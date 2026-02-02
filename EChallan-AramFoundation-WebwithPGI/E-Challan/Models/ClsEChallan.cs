using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace E_Challan.Models
{
    public class ClsEChallan
    {

        public int Id { get; set; }
        
        [Required(ErrorMessage="This field is required")]
        public string strRecptNo { get; set; }

        [Required(ErrorMessage="This field is required")]
        public int intDonartype { get; set; }
        
        public string strAccNo { get; set; }

        [Required(ErrorMessage="This field is required")]
        public string strNameOfDonar { get; set; }

        [Required(ErrorMessage="This field is required")]
        public string strAddress { get; set; }

        [Required(ErrorMessage="This field is required")]
        public string strCity { get; set; }

        [Required(ErrorMessage = "This field is required")]
        public int? intState { get; set; }
        [Required(ErrorMessage = "This field is required")]
        public string strState { get; set; }

        [Required(ErrorMessage = "This field is required")]
        public int?  intCountry { get; set; }
        [Required(ErrorMessage = "This field is required")]
        public string strCountry { get; set; }

        [Required(ErrorMessage="This field is required")]
        public string strPincode { get; set; }

        //[Required(ErrorMessage="This field is required")]
        public string strTeleNumber { get; set; }

        [Required(ErrorMessage="This field is required")]
       // [RegularExpression(@"^.{10,}$", ErrorMessage = "Mobile number should be in 10 characters")]
       // [StringLength(10, ErrorMessage = "Please enter 10 digit number")]
        public string strMobNumber { get; set; }

        [Required(ErrorMessage="This field is required")]
        [RegularExpression(@"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$", ErrorMessage = "Provide proper E-mail")]
        public string strEmail { get; set; }

        [Required(ErrorMessage="This field is required")]
        public string strPaymentMode { get; set; }

        [Required(ErrorMessage="This field is required")]
        public decimal? decAmount { get; set; }

        public string strAmountInWords { get; set; }

      //  [Required(ErrorMessage="This field is required")]
      //  public int? intChequeNumber { get; set; }

        [Required(ErrorMessage = "This field is required")]
        public string strChequeNumber { get; set; }

       

        public DateTime? dtChequeDate { get; set; }
        [Required(ErrorMessage="This field is required")]
        public string strChequeDate { get; set; }
        [Required(ErrorMessage = "This field is required")]
        public string strChequeBank { get; set; }
        [Required(ErrorMessage = "This field is required")]
        public string strChequeBranch { get; set; }

       // [Required(ErrorMessage="This field is required")]
       // public int? intDDNumber { get; set; }

        [Required(ErrorMessage = "This field is required")]
        public string strDDNumber { get; set; }

        public DateTime dtDDDate { get; set; }
        [Required(ErrorMessage="This field is required")]
        public string strDDDate { get; set; }
        [Required(ErrorMessage = "This field is required")]
        public string strDDBank { get; set; }
        [Required(ErrorMessage = "This field is required")]
        public string strDDBranch { get; set; }

        //[Required(ErrorMessage="This field is required")]
        public string strPANcardNumber { get; set; }
         
        public DateTime? dtRecptDate { get; set; }
        public string srtRecptDate { get; set; }

        [Required(ErrorMessage="This field is required")]
        public string strRecptDate { get; set; }

        [Required(ErrorMessage="This field is required")]
        public string DonorTypes { get; set; }

        //[Required(ErrorMessage = "This field is required")]
        //public string strLocation { get; set; }
        
        public string SearchKey { get; set; }

        public string strButtonValue { get; set; }

        public bool IsCheck { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string period { get; set; }

        public int chkCount { get; set; }

        public int chkGrantTotalCount { get; set; }

        public decimal? RowTotal { get; set; }

        public decimal? ColoumTotal { get; set; }

        public decimal? GrandTotal { get; set; }

        public int chkHeaderCount { get; set; }

        public int DonerTypeCount { get; set; }

        public int intColumCount { get; set; }

        public List<ClsEChallan> lstHeader { get; set; }

        public List<ClsEChallan> lstBelowHeader { get; set; }

        public List<ClsEChallan> lstGrandTotal { get; set; }

        public List<ClsEChallan> lstDateCount { get; set; }

        //public Dictionary<string,string> dictValues { get; set; }

       // public Dictionary<string, string[,]> dictValues = new Dictionary<string, string[,]>();
        public Dictionary<string, List<string[]>> dictCashValues = new Dictionary<string, List<string[]>>();
        public Dictionary<string, List<string[]>> dictOtherValues = new Dictionary<string, List<string[]>>();



        public Dictionary<string, decimal> dicDonorTypes;

    }
}