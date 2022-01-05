import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  ltd: number;

  @IsNumber()
  @Min(0)
  mileage: number;

  @IsNumber()
  @Min(1)
  @Max(1000000)
  price: number;
}
