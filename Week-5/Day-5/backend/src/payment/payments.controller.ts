import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { Payment } from './schemas/payment.schema';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(
    @Body()
    body: {
      auction: string;
      user: string;
      bid: string;
      amount: number;
      transactionId?: string;
    },
  ): Promise<Payment> {
    return this.paymentService.createPayment({
      auction: body.auction as any,
      user: body.user as any,
      bid: body.bid as any,
      amount: body.amount,
      transactionId: body.transactionId,
    });
  }

  @Get()
  async getAllPayments(): Promise<Payment[]> {
    return this.paymentService.getAllPayments();
  }

  @Get('user/:userId')
  async getPaymentsByUser(@Param('userId') userId: string): Promise<Payment[]> {
    return this.paymentService.getPaymentsByUser(userId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<Payment> {
    return this.paymentService.updateStatus(id, body.status);
  }
}
