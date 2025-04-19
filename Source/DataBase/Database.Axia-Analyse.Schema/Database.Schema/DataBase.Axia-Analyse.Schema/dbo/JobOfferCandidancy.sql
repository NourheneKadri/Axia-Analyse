CREATE TABLE [dbo].[JobOfferCandidancy]
(
	[Id] INT NOT NULL IDENTITY PRIMARY KEY,
	[FirstName] VARCHAR(30),
	[LastName] VARCHAR(30),
	[Email] VARCHAR(100),
	[CandidateProfileId] INT NOT NULL,
    [JobOfferId] INT NOT NULL,
	[SubmissionDate] DATETIME DEFAULT GETDATE(),
	[UpdatedAt] DATETIME DEFAULT GETDATE(),
    [StatusId] INT NOT NULL,
	[CvUrl]VARCHAR(max),
	[score]VARCHAR(max),
	[Timestamp] DATETIME2,
	CONSTRAINT [JobOfferCandidancy_CandidateProfileId] FOREIGN KEY ([CandidateProfileId]) REFERENCES [dbo].[UserAccount]([Id]),
    CONSTRAINT [JobOfferCandidancy_JobOfferId] FOREIGN KEY ([JobOfferId]) REFERENCES [dbo].[JobOffer]([Id]),
	CONSTRAINT [JobOfferCandidancy_StatusId] FOREIGN KEY ([StatusId]) REFERENCES [dbo].[JobOfferCandidancyStatus]([Id])
)
