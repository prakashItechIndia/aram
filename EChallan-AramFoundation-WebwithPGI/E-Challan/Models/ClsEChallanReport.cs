using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace E_Challan.Models
{
    public class ClsEChallanReport
    {

       

       
        public string Receipt_No { get; set; }

        

        public string Account_No { get; set; }

        public string Name_Of_Donor { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string Pincode { get; set; }

        public string Telephone { get; set; }

        public string Mobile { get; set; }

        public string Email { get; set; }

        [Required(ErrorMessage = "Please select Donor Types")]
        public string DonorTypes { get; set; }

        public string PaymentMode { get; set; }

        public decimal? Amount { get; set; }

       // public int? DDChequeNumber { get; set; }


        public string strDDorChequeNumber { get; set; }

        public string DDChequeDate { get; set; }

        public string PANcardNumber { get; set; }

       
        public string Receipt_Date { get; set; }

        [Required(ErrorMessage = "Please select From Date")]
        public string FromDate { get; set; }
        public string strFromDate { get; set; }

        [Required(ErrorMessage = "Please select To Date")]
        public string ToDate { get; set; }
        public string strToDate { get; set; }



        public string period { get; set; }

        public int Id { get; set; }

        public int intDonartype { get; set; }


        public DateTime dtDDChequeDate { get; set; }

        public DateTime dtRecptDate { get; set; }

        public string CreatedDate { get; set; }


      //  public decimal? dctotamt { get; set; }

    }
}