# Roles and permissions

| Capability | Super admin | Administrator | Instructor | Department manager | Learner |
|---|:---:|:---:|:---:|:---:|:---:|
| System configuration and audit | Yes | Limited | No | No | No |
| Manage users and organization | Yes | Yes | No | No | No |
| Manage all courses | Yes | Yes | No | No | No |
| Manage owned courses and assessments | Yes | Yes | Yes | No | No |
| View organization reports | Yes | Yes | No | No | No |
| View scoped department reports | Yes | Yes | No | Yes | No |
| Grade/issue for owned courses | Yes | Yes | Yes | No | No |
| Enroll, learn, take assessments | No | No | Preview only | No | Yes |
| View own certificates | Yes | Yes | Owned-course scope | Department scope | Yes |

All checks are server-enforced. Instructors are restricted by `tutorId`/`createdBy`; department managers are restricted by their assigned `department`; learners are restricted by `userId`. The legacy role values `admin`, `tutor`, and `student` map to administrator, instructor, and learner capabilities until data migration is complete.

Creating or editing a super administrator through the general user API is prohibited. The production-safe initializer is the only supported bootstrap path.
