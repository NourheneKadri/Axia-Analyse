	CREATE TABLE [dbo].[JobOffer]
	(
		[Id] INT NOT NULL IDENTITY PRIMARY KEY,
		[Title] VARCHAR(max),
		[Description] VARCHAR(max),
		[Adress] VARCHAR(max),
		[Requirements] VARCHAR(max),
		[SalaryRange] VARCHAR(max),
		[Timestamp] DATETIME2,
		[DeadlineTimestamp] DATETIME2,
		[DeleteTimestamp] DATETIME2,
		[Status] VARCHAR(50) DEFAULT 'Open',
		[PostNumber] INT,
		[ExperienceLevel] VARCHAR(50),
		[SkillsRequired] NVARCHAR(MAX),
		[UserAccountId] INT,
		[JobTypeId] INT,
		[CategorieId] INT,
		CONSTRAINT [JobOffer_UserAccount] FOREIGN KEY ([UserAccountId]) REFERENCES dbo.UserAccount([Id]),
		CONSTRAINT [JobOffer_JobOfferTypes] FOREIGN KEY ([JobTypeId]) REFERENCES dbo.JobOfferType([Id]),
		CONSTRAINT [JobOffer_JCategorie] FOREIGN KEY ([CategorieId]) REFERENCES dbo.JobOfferCategories([Id]),


	)
