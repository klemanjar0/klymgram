import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './db/config';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(DatabaseConfig), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
