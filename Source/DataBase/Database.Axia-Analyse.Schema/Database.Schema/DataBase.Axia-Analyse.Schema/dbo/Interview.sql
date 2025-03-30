CREATE TABLE [dbo].[interview]
(
	[Id] INT NOT NULL IDENTITY PRIMARY KEY,
	[CandidateId] INT NOT NULL,
    [RecruiterId] INT NOT NULL,
    [JobId] INT NOT NULL,
    [Date] DATETIME NOT NULL,
    [Time] TIME NOT NULL,
    [Location] VARCHAR(255),
    [StatusId] INT NOT NULL,
    [Notes] VARCHAR(200),
    CONSTRAINT [FK_Interview_CandidateProfile] FOREIGN KEY ([CandidateId]) 
        REFERENCES [dbo].[UserAccount]([Id]),
    CONSTRAINT [FK_Interview_RecruiterProfile] FOREIGN KEY ([RecruiterId]) 
        REFERENCES [dbo].[UserAccount]([Id]),
    CONSTRAINT [FK_Interview_InterviewStatus] FOREIGN KEY ([StatusId]) 
        REFERENCES [dbo].[InterviewStatus]([Id]),
         CONSTRAINT [FK_Interview_JobOffer] FOREIGN KEY ([JobId]) 
        REFERENCES [dbo].[JobOffer]([Id]) 

)
