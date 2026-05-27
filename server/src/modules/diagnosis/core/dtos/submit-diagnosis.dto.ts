import { IsArray, IsNumber, IsString, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SkillDto {
  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  score!: number;
}

export class SubmitDiagnosisDto {
  @IsArray()
  @IsString({ each: true })
  answers!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  skills!: SkillDto[];
}
