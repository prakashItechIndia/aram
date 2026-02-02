using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace E_Challan.Models
{


    public class ClsUploadedList
    {

        public string DonationCode { get; set; }

        

        public string Name_of_Donor { get; set; }

        public string Address { get; set; }

        public string StateName { get; set; }

        public string CountryName { get; set; }



        public string City { get; set; }

        public string Pincode { get; set; }

        public string Telephone { get; set; }

        public string MobileNumber { get; set; }

        public string Email { get; set; }

        public string PaymentMode { get; set; }

        public decimal Amount { get; set; }

        public string AmountInWords { get; set; }

       // public int DDorChequeNumber { get; set; }

        public string strDDorChequeNumber { get; set; }

        public string DDorChequeDate { get; set; }

        public string DDorChequeBankName { get; set; }

        public string DDorChequeBranch { get; set; }

        public string PANcardNumber { get; set; }

       // public string Location { get; set; }

        public string ReceiptDate { get; set; }

        public string Remarks { get; set; }

        public bool IsActive { get; set; }

        public int CreatedBy { get; set; }

        public string CreatedDate { get; set; }

        

        public int StateId { get; set; }

        public int CountryId { get; set; }

        public string Receipt_Number { get; set; }

        public int Donation_Types { get; set; }

        public string Account_Number { get; set; }

    }
}