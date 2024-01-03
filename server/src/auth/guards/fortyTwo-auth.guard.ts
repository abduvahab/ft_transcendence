import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class fortyTwoAuthGuard extends AuthGuard('42'){}