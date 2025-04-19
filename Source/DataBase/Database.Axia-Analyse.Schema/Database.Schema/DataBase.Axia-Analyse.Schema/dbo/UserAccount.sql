CREATE TABLE [dbo].[UserAccount]
(
	[Id] INT NOT NULL IDENTITY PRIMARY KEY,
	[FirstName] VARCHAR(100),
	[LastName] VARCHAR(100),
	[Email] VARCHAR(100),
	[Password] VARCHAR(255),
	[AppRoleId] INT  NOT NULL,
	[CompanyId] INT,
	[Timestamp] DATETIME2,
	[PhotoLogo]  VARCHAR(255),
	CONSTRAINT [UserAccount_AppRoleId] FOREIGN KEY ([AppRoleId]) REFERENCES [dbo].[AppRole]([Id]),
	CONSTRAINT [UserAccount_CompanyId] FOREIGN KEY ([CompanyId]) REFERENCES [dbo].[Company]([Id])

	)
	
