CREATE TABLE [dbo].[interview]
(
	[Id] INT NOT NULL IDENTITY PRIMARY KEY,
	[CandidateId] INT NOT NULL,
    [RecruiterId] INT NOT NULL,
    [JobId] INT NOT NULL,
    [SlotId] INT NOT NULL,
    [InterviewDate] DATETIME NOT NULL,
    [InterviewTime] TIME NOT NULL,
    [Location] VARCHAR(255),
    [StatusId] INT NOT NULL,
    [CreatedAt] DATETIME2 DEFAULT GETDATE(),
	[UpdatedAt] DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT [FK_Interview_CandidateProfile] FOREIGN KEY ([CandidateId]) 
        REFERENCES [dbo].[UserAccount]([Id]),
    CONSTRAINT [FK_Interview_RecruiterProfile] FOREIGN KEY ([RecruiterId]) 
        REFERENCES [dbo].[UserAccount]([Id]),
    CONSTRAINT [FK_Interview_InterviewStatus] FOREIGN KEY ([StatusId]) 
        REFERENCES [dbo].[InterviewStatus]([Id]),
         CONSTRAINT [FK_Interview_JobOffer] FOREIGN KEY ([JobId]) 
        REFERENCES [dbo].[JobOffer]([Id]) ,
        	CONSTRAINT [Interview_SlotId] FOREIGN KEY ([SlotId]) REFERENCES [dbo].[Slot]([Id])


)
