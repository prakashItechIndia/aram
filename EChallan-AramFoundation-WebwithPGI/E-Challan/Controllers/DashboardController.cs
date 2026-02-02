using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using E_Challan.Models;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using System.Data;
using System.Text;
using System.IO;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using System.Configuration;

namespace E_Challan.Controllers
{
    public class DashboardController : Controller
    {
        
        public string strStatusMsg="";     
        public ActionResult Dashboard()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }
            return View();
        }

        #region"--------LogHistory List---------"

        public ActionResult LogHistory()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }

            return View();
        }

        [HttpPost]
        public JsonResult CheckLogHistory(string SearchKey)
        {            
            try
            {
                ClsCommon.lstLogHistory.Clear();
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    if (SearchKey != "")
                    {
                        var reportlist = ObjEnty.sp_GetLogHistory(SearchKey).ToList();
                        if (reportlist.Count() != 0)
                        {

                            foreach (var f in reportlist)
                            {
                                ClsLogHistory ObjCls = new ClsLogHistory();
                                ObjCls.Id = f.Id;
                                ObjCls.ReceiptNumber = f.Receipt_Number;
                                ObjCls.Date = f.CurrentDate.FormatWith("{0:dd/MM/yyyy}");
                                ObjCls.Time = f.CurrentTime;
                                ObjCls.Type = f.Type;
                                ObjCls.Name = f.Name;
                                ClsCommon.lstLogHistory.Add(ObjCls);
                            }
                            strStatusMsg = "Success";
                        }
                    }

                    else
                    {
                        ClsCommon.lstLogHistory.Clear();                        
                    }
                }
                return Json(new { strStatusMsg, ClsCommon.lstLogHistory }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public FileResult ExportToExcel([DataSourceRequest]DataSourceRequest request)
        {
            List<string> lstFilterColumns = new List<string>() { "Id", "EChallanId", "strSearchKey", "IsCheck" };

            //Return the result to the end user
            byte[] byteExport = ClsCommon.ToExport(ClsCommon.lstLogHistory, lstFilterColumns);

            return File(byteExport,   //The binary data of the XLS file
                 "application/vnd.ms-excel", //MIME type of Excel files
                 "EChallanExcelExport.xls");     //Suggested file name in the "Save as" dialog which will be displayed to the end user

        }

        #endregion
    }
}
