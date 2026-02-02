using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace E_Challan.Models
{
    public class ClsDonorCategories
    {
        public int Id { get; set; }

        //[DisplayName("Account Number")]
        [Required(ErrorMessage="This is Required")]
        public string AccountNo { get; set; }

        //[DisplayName("Type Of Donor")]
        [Required(ErrorMessage="This is Required")]
        public string DonorTypes { get; set; }

        [Required(ErrorMessage = "This is Required")]
        public string DonationCode { get; set; }



        //[DisplayName("Active")]
        [Required(ErrorMessage="This is Required")]
        public Boolean IsActive { get; set; }

        public bool IsCheck { get; set; }

        public bool? Status { get; set; }


        public string strStatus { get; set; }
    }
}