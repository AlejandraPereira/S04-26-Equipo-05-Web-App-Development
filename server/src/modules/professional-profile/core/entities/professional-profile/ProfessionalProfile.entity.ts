import { CreateProfessionalProfileDTO } from './dto/CreateProfessionalProfile.dto';
import { ProfessionalProfileDTO } from './dto/ProfessionalProfile.dto';

export class ProfessionalProfile {
  private _id?: string;
  private _userId!: string;
  private _headline!: string | null;
  private _summary!: string | null;
  private _location!: string | null;
  private _yearsExperience!: number | null;
  private _linkedinUrl!: string | null;
  private _completionScore!: number;
  private _lastUpdated!: Date;

  private constructor() {}

  public static create(
    data: CreateProfessionalProfileDTO,
  ): ProfessionalProfileDTO {
    const profile = new ProfessionalProfile();

    const id = data.id ?? crypto.randomUUID();

    profile
      .setId(id)
      .setUserId(data.userId)
      .setHeadline(data.headline ?? null)
      .setSummary(data.summary ?? null)
      .setLocation(data.location ?? null)
      .setYearsExperience(data.yearsExperience ?? null)
      .setLinkedinUrl(data.linkedinUrl ?? null)
      .setCompletionScore(data.completionScore ?? 0)
      .setLastUpdated(data.lastUpdated ?? new Date());

    return profile.toJSON();
  }

  private setId(id: string): this {
    if (!id || id.trim().length === 0) {
      throw new Error('ID cannot be empty');
    }

    this._id = id;

    return this;
  }

  private setUserId(userId: string): this {
    if (!userId || userId.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }

    this._userId = userId;

    return this;
  }

  private setHeadline(headline: string | null): this {
    if (headline && headline.length > 200) {
      throw new Error('Headline cannot exceed 200 characters');
    }

    this._headline = headline;

    return this;
  }

  private setSummary(summary: string | null): this {
    if (summary && summary.length > 2000) {
      throw new Error('Summary cannot exceed 2000 characters');
    }

    this._summary = summary;

    return this;
  }

  private setLocation(location: string | null): this {
    if (location && location.length > 150) {
      throw new Error('Location cannot exceed 150 characters');
    }

    this._location = location;

    return this;
  }

  private setYearsExperience(yearsExperience: number | null): this {
    if (
      yearsExperience !== null &&
      yearsExperience !== undefined &&
      yearsExperience < 0
    ) {
      throw new Error('Years of experience cannot be negative');
    }

    this._yearsExperience = yearsExperience;

    return this;
  }

  private setLinkedinUrl(linkedinUrl: string | null): this {
    this._linkedinUrl = linkedinUrl;

    return this;
  }

  private setCompletionScore(completionScore: number): this {
    if (completionScore < 0 || completionScore > 100) {
      throw new Error('Completion score must be between 0 and 100');
    }

    this._completionScore = completionScore;

    return this;
  }

  private setLastUpdated(lastUpdated: Date): this {
    this._lastUpdated = lastUpdated;

    return this;
  }

  private toJSON(): ProfessionalProfileDTO {
    return {
      id: this._id,
      userId: this._userId,
      headline: this._headline,
      summary: this._summary,
      location: this._location,
      yearsExperience: this._yearsExperience,
      linkedinUrl: this._linkedinUrl,
      completionScore: this._completionScore,
      lastUpdated: this._lastUpdated,
    };
  }
}
