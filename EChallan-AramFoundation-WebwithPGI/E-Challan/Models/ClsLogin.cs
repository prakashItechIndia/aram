using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace E_Challan.Models
{
    public class ClsLogin
    {
        [Required(ErrorMessage = "This field is required")]
        public string strUsername { get; set; }

        [Required(ErrorMessage="This field is required")]
        public string strPassword { get; set; }

        [Required(ErrorMessage = "The New Password field is required")]
        public string strNewPassword { get; set; }

        [Required(ErrorMessage = "The Confirm Password field is required")]        
        [Compare("strNewPassword", ErrorMessage = "New Password must match confirm password")]
        public string strConfirmPassword { get; set; }

        [Required(ErrorMessage = "The Email field is required")]
        [RegularExpression(@"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$", ErrorMessage = "Provide proper E-mail")]
        public string strEmail { get; set; }
    }
}