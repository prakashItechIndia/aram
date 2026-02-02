using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace E_Challan.Models
{
    public class ClsLogHistory
    {
       

        public string Date { get; set; }

        public string Time { get; set; }

        public string Type { get; set; }

        public string ReceiptNumber { get; set; }

        public string Name { get; set; }

        public int Id { get; set; }

        public int EChallanId { get; set; }

        public string strSearchKey { get; set; }

        public bool IsCheck { get; set; }

    }
}