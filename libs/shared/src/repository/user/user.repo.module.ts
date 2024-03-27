import { Module } from '@nestjs/common';
import { UserRepoService } from '@app/shared/repository/user/user.repo.service';

@Module({
  providers: [UserRepoService],
  exports: [UserRepoService],
})
export class UserRepoModule {}
