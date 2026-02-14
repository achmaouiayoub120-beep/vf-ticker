import { IsArray, IsNumber, ArrayMinSize, Min } from 'class-validator';

export class LockDto {
  @IsNumber()
  @Min(1)
  matchId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  seats: number[];
}
