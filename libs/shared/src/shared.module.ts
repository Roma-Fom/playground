import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { UserRepoModule } from './repository/user/user.repo.module';

@Module({
  providers: [SharedService],
  exports: [SharedService],
  imports: [UserRepoModule],
})
export class SharedModule {}
