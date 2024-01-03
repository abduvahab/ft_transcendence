import { User } from "src/user/entities/user.entity";


export class AuthPayload {
	constructor(user: User) {
		this.id = user.id;
	}

	id: number;
}
