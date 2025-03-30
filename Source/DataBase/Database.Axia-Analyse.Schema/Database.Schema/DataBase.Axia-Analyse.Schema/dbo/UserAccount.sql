CREATE TABLE [dbo].[UserAccount]
(
	[Id] INT NOT NULL IDENTITY PRIMARY KEY,
	[FirstName] VARCHAR(30),
	[LastName] VARCHAR(30),
	[Email] VARCHAR(100),
	[Password] VARCHAR(255),
	[AppRoleId] INT  NOT NULL,
	[CompanyId] INT,
	CONSTRAINT [UserAccount_AppRoleId] FOREIGN KEY ([AppRoleId]) REFERENCES [dbo].[AppRole]([Id]),
	CONSTRAINT [UserAccount_CompanyId] FOREIGN KEY ([CompanyId]) REFERENCES [dbo].[Company]([Id])

	)
	
