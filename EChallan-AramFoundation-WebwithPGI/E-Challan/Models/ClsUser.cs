using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace E_Challan.Models
{
    public class ClsUser
    {


        public int intId { get; set; }

        [Required(ErrorMessage="This field is required")]
        public string strName { get; set; }

        [Required(ErrorMessage = "This field is required")]
        public string strUserType { get; set; }


        [Required(ErrorMessage = "This field is required")]
        public string strUserName { get; set; }

        [Required(ErrorMessage = "This field is required")]
        public string strPassword { get; set; }

        [Required(ErrorMessage = "This field is required")]
        public string strMobile { get; set; }

        //[Required(ErrorMessage = "This field is required")]
        //public string strLocation { get; set; }

        [Required(ErrorMessage = "This field is required")]
        [RegularExpression(@"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$", ErrorMessage = "Provide proper E-mail")]
        public string strEmail { get; set; }

        public bool IsCheck { get; set; }


    }
}