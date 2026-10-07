'use client'

import { UserPlus, Users } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { FilterSelect } from '@/components/shared/filter-select'
import { PageHeader } from '@/components/shared/page-header'
import { PaginationBar } from '@/components/shared/pagination-bar'
import { SearchInput } from '@/components/shared/search-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUrlState } from '@/hooks/use-url-state'
import { useI18n } from '@/i18n/provider'
import type { UserListItemDto } from '@/shared/dto'
import { ASSIGNABLE_ROLES, ROLES } from '@/shared/roles'
import { useDepartments, useUsers, type UserListParams } from './api'
import { ResetPasswordDialog } from './components/reset-password-dialog'
import type { UserActionHandlers } from './components/user-actions-menu'
import { UserDetailSheet } from './components/user-detail-sheet'
import { UserFormDialog } from './components/user-form-dialog'
import { UserStatusDialog } from './components/user-status-dialog'
import { UserTable } from './components/user-table'
import { useDialogTarget } from './hooks'

const PAGE_SIZE = 20
const ROLE_FILTERS = [ROLES.SUPER_ADMIN, ...ASSIGNABLE_ROLES] as const

export function UsersPage() {
  const { t, formatNumber } = useI18n()
  // `search` (not `q`) because the global search links here with ?search=<email>.
  const [filters, setFilters] = useUrlState({ search: '', role: '', status: '', department: '', page: '1', new: '' })
  const departments = useDepartments()
  const params: UserListParams = {
    search: filters.search || undefined,
    role: filters.role || undefined,
    status: filters.status === 'active' || filters.status === 'inactive' ? filters.status : undefined,
    department: filters.department || undefined,
    page: Number(filters.page) || 1,
    limit: PAGE_SIZE,
  }
  const users = useUsers(params)
  const filtered = Boolean(filters.search || filters.role || filters.status || filters.department)

  const creating = useDialogTarget<true>()
  const editing = useDialogTarget<UserListItemDto>()
  const resetting = useDialogTarget<UserListItemDto>()
  const toggling = useDialogTarget<UserListItemDto>()
  const viewing = useDialogTarget<string>()

  const actions: UserActionHandlers = {
    onView: (user) => viewing.show(user.id),
    onEdit: editing.show,
    onResetPassword: resetting.show,
    onToggleStatus: toggling.show,
  }

  const total = users.data?.meta.total

  return (
    <div>
      <PageHeader
        title={
          <span className="inline-flex items-center gap-3">
            {t('users.page.title')}
            {total !== undefined && (
              <Badge variant="muted" className="text-sm tabular-nums">
                <span aria-hidden="true">{formatNumber(total)}</span>
                <span className="sr-only">{t('users.page.total', { count: total })}</span>
              </Badge>
            )}
          </span>
        }
        description={t('users.page.description')}
        actions={
          <Button onClick={() => creating.show(true)}>
            <UserPlus aria-hidden="true" />
            {t('users.add')}
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchInput value={filters.search} onChange={(search) => setFilters({ search })} placeholder={t('users.search')} className="lg:max-w-sm lg:flex-1" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
          <FilterSelect
            value={filters.role}
            onChange={(role) => setFilters({ role })}
            allLabel={t('users.filter.allRoles')}
            ariaLabel={t('common.role')}
            options={ROLE_FILTERS.map((role) => ({ value: role, label: t(`role.${role}`) }))}
          />
          <FilterSelect
            value={filters.status}
            onChange={(status) => setFilters({ status })}
            allLabel={t('users.filter.allStatuses')}
            ariaLabel={t('common.status')}
            options={[
              { value: 'active', label: t('status.active') },
              { value: 'inactive', label: t('status.inactive') },
            ]}
            className="lg:w-44"
          />
          <FilterSelect
            value={filters.department}
            onChange={(department) => setFilters({ department })}
            allLabel={t('users.filter.allDepartments')}
            ariaLabel={t('common.department')}
            options={(departments.data ?? []).map((department) => ({ value: department.name, label: department.name }))}
            className="lg:w-64"
          />
        </div>
      </div>

      {users.isError ? (
        <ErrorState error={users.error} onRetry={() => users.refetch()} />
      ) : (
        <>
          <div aria-busy={users.isFetching}>
            <UserTable
              rows={users.data?.items}
              loading={users.isPending}
              actions={actions}
              empty={
                <EmptyState
                  compact
                  icon={Users}
                  className="border-0 bg-transparent"
                  title={filtered ? t('state.noResults') : t('users.empty')}
                  description={filtered ? t('state.noResultsHint') : t('users.emptyHint')}
                  action={
                    filtered && (
                      <Button variant="outline" onClick={() => setFilters({ search: '', role: '', status: '', department: '' })}>
                        {t('action.reset')}
                      </Button>
                    )
                  }
                />
              }
            />
          </div>
          {users.data && <PaginationBar meta={users.data.meta} onPageChange={(page) => setFilters({ page })} />}
        </>
      )}

      <UserFormDialog
        // `?new=1` (used by the dashboard quick action) opens the create dialog directly.
        open={creating.open || filters.new === '1'}
        onOpenChange={(open) => {
          creating.onOpenChange(open)
          if (!open && filters.new) setFilters({ new: null, page: filters.page })
        }}
      />
      <UserFormDialog open={editing.open} onOpenChange={editing.onOpenChange} user={editing.target} />
      <ResetPasswordDialog open={resetting.open} onOpenChange={resetting.onOpenChange} user={resetting.target} />
      <UserStatusDialog open={toggling.open} onOpenChange={toggling.onOpenChange} user={toggling.target} />
      <UserDetailSheet
        open={viewing.open}
        onOpenChange={viewing.onOpenChange}
        userId={viewing.target}
        actions={{ onEdit: editing.show, onResetPassword: resetting.show, onToggleStatus: toggling.show }}
      />
    </div>
  )
}
