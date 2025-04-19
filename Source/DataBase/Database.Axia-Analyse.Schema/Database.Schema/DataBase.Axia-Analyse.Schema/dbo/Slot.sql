CREATE TABLE [dbo].[Slot]
(
	[Id] INT NOT NULL IDENTITY PRIMARY KEY,
	[SlotDate] DATE NOT NULL,
	[StartTime] TIME NOT NULL,
	[EndTime] TIME NOT NULL,
	[IsAvailable] BIT DEFAULT 1,
	[RecruiterId] INT NOT NULL,
	[Timestamp] DATETIME2,
	[CreatedAt] DATETIME2 DEFAULT GETDATE(),
	[UpdatedAt] DATETIME2 DEFAULT GETDATE(),
	CONSTRAINT [Slots_RecruiterId] FOREIGN KEY ([RecruiterId]) REFERENCES [dbo].[UserAccount]([Id])

)
