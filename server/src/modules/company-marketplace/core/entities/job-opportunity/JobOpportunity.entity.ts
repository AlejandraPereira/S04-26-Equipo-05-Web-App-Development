import { CreateJobOpportunityDTO } from './dto/CreateJobOpportunity.dto';
import { JobOpportunityDTO } from './dto/JobOpportunity.dto';
import { OpportunityStatus } from './OpportunityStatus';

export class JobOpportunity {
  private _id?: string;
  private _companyId!: string;
  private _title!: string;
  private _description!: string;
  private _location!: string;
  private _isRemote!: boolean;
  private _minSalary!: number;
  private _maxSalary!: number;
  private _status!: OpportunityStatus;
  private _publishedAt!: Date;
  private _expiresAt!: Date;

  private constructor() {}

  public static create(data: CreateJobOpportunityDTO): JobOpportunityDTO {
    const job = new JobOpportunity();
    const id = data.id ?? crypto.randomUUID();
    job
      .setId(id)
      .setCompanyId(data.companyId)
      .setTitle(data.title)
      .setDescription(data.description)
      .setLocation(data.location)
      .setIsRemote(data.isRemote)
      .setMinSalary(data.minSalary)
      .setMaxSalary(data.maxSalary)
      .setStatus(data.status)
      .setPublishedAt(data.publishedAt)
      .setExpiresAt(data.expiresAt);

    if (data.minSalary > data.maxSalary) {
      throw new Error('Min salary cannot be greater than max salary');
    }

    return job.toJSON();
  }

  private setId(id: string): this {
    if (!id || id.trim().length === 0) throw new Error('ID cannot be empty');
    this._id = id;
    return this;
  }

  private setCompanyId(companyId: string): this {
    if (!companyId || companyId.trim().length === 0)
      throw new Error('Company ID cannot be empty');
    this._companyId = companyId;
    return this;
  }

  private setTitle(title: string): this {
    if (!title || title.trim().length < 3)
      throw new Error('Title must be at least 3 characters');
    this._title = title;
    return this;
  }

  private setDescription(description: string): this {
    if (!description || description.trim().length === 0)
      throw new Error('Description cannot be empty');
    this._description = description;
    return this;
  }

  private setLocation(location: string): this {
    if (!location || location.trim().length === 0)
      throw new Error('Location cannot be empty');
    this._location = location;
    return this;
  }

  private setIsRemote(isRemote: boolean): this {
    this._isRemote = isRemote;
    return this;
  }

  private setMinSalary(minSalary: number): this {
    if (minSalary < 0) throw new Error('Min salary cannot be negative');
    this._minSalary = minSalary;
    return this;
  }

  private setMaxSalary(maxSalary: number): this {
    if (maxSalary < 0) throw new Error('Max salary cannot be negative');
    this._maxSalary = maxSalary;
    return this;
  }

  private setStatus(status: OpportunityStatus): this {
    if (!status) throw new Error('Status is required');
    if (!Object.values(OpportunityStatus).includes(status)) {
      throw new Error(`Invalid opportunity status: ${status}`);
    }
    this._status = status;
    return this;
  }

  private setPublishedAt(publishedAt: Date): this {
    if (!publishedAt) throw new Error('Published date is required');
    this._publishedAt = publishedAt;
    return this;
  }

  private setExpiresAt(expiresAt: Date): this {
    if (!expiresAt) throw new Error('Expires date is required');
    this._expiresAt = expiresAt;
    return this;
  }

  public toJSON(): JobOpportunityDTO {
    return {
      id: this._id,
      companyId: this._companyId,
      title: this._title,
      description: this._description,
      location: this._location,
      isRemote: this._isRemote,
      minSalary: this._minSalary,
      maxSalary: this._maxSalary,
      status: this._status,
      publishedAt: this._publishedAt,
      expiresAt: this._expiresAt,
    };
  }
}
