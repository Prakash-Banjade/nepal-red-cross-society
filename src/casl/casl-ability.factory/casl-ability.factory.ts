import { AbilityBuilder, ExtractSubjectType, InferSubjects, MongoAbility, createMongoAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action, AuthUser, Roles } from "src/core/types/global.types";
import { DonationEvent } from "src/donation_events/entities/donation_event.entity";
import { User } from "src/users/entities/user.entity";

export type Subjects = InferSubjects<typeof User> | InferSubjects<typeof DonationEvent> | 'me' | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
    defineAbility(user: AuthUser) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

        if (user.role === Roles.ADMIN) {
            can(Action.MANAGE, 'all')
            can(Action.MANAGE, User)
        } else if (user.role === Roles.MODERATOR) {
            can(Action.CREATE, 'all')
            can(Action.READ, 'all')
            can(Action.UPDATE, 'all')
            cannot(Action.CREATE, User)
            cannot(Action.DELETE, 'all').because('Only admins are allowed to delete records.')
            cannot(Action.RESTORE, 'all').because('Only admins are allowed to restore records.')
        } else if (user.role === Roles.USER) {
            cannot(Action.READ, 'all').because('You do not have access privillege to this operation.')
            can(Action.READ, 'me')
            can(Action.READ, DonationEvent)
            cannot(Action.CREATE, 'all').because('You do not have access privillege to this operation.')
            cannot(Action.UPDATE, 'all').because('You do not have access privillege to this operation.')
            cannot(Action.DELETE, 'all').because('You do not have access privillege to this operation.')
            cannot(Action.RESTORE, 'all').because('You do not have access privillege to this operation.')
        }

        return build({
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
        })
    }
}