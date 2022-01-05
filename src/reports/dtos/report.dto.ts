import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  ltd: number;

  @Expose()
  mileage: number;

  @Expose()
  price: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  user_id: number;
}
