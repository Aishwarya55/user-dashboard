import { User } from './user.model'
import { crudService } from '../../utils/dbOperation'

export default userController = crudService(User)

