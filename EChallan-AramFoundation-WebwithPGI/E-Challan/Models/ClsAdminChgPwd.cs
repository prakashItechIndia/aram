using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace E_Challan.Models
{
    public class ClsAdminChgPwd
    {
        public int intId { get; set; }

        [Required(ErrorMessage = "This field is required")]
        public string strName { get; set; }

        
        public string strUserName { get; set; }


        public string strUserType { get; set; }


        [DataType(DataType.Password)]
        [Required(ErrorMessage = "Password is required")]
        public string strPassword { get; set; }

        [DataType(DataType.Password)]
        [Compare("strPassword", ErrorMessage = "Password must match confirm password")]
        [Required(ErrorMessage = "Confirm Password is required")]
        public string strConfirmPassword { get; set; }

    }
}