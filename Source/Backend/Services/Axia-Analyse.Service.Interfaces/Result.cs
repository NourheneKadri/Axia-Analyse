using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service
{
    public class Result
    {
        public bool IsSuccess { get; }
        public bool IsFailure => !IsSuccess;
        public string Error { get; }

        private Result(bool isSuccess, string error = null)
        {
            IsSuccess = isSuccess;
            Error = error;
        }

        public static Result Success() => new Result(true);
        public static Result Failure(string error) => new Result(false, error);
    }
}
