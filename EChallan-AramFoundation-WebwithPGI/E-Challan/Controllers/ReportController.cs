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
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using System.Reflection;
using NPOI.SS.Formula.Functions;
using System.Data.SqlClient;




namespace E_Challan.Controllers
{
    public class ReportController : Controller
    {
        public static List<ClsEChallanReport> lstGridEchallanReport = new List<ClsEChallanReport>();
        public string StrConnectionString = Convert.ToString(ConfigurationSettings.AppSettings["MyConnectionString"]);
        public string strStatusMsg = "";
        DataSet ds = new DataSet();
        DataTable dtCash = new DataTable();
        DataTable dtDD = new DataTable();
        SqlDataAdapter da = new SqlDataAdapter();

        #region------------------------- Report for EChallan-------------

        public ActionResult Create()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }
            ClsCommon.lstEchallanReport.Clear();
            GetUserList();
            return View();
        }

        #endregion

        #region--------------------------Donor DropDownlist----------------

        public List<ClsDonorCategories> GetUserList()
        {
            ClsCommon.lstDonorCategories.Clear();

            using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
            {
                ClsCommon.lstDonorCategories = (from f in ObjEnty.T_DONOR_CATEGORIES
                                                where f.Is_Active == true
                                                select new ClsDonorCategories
                                                {
                                                    Id = f.Id,
                                                    DonorTypes = f.Donor_Types,


                                                }).ToList();
            }
            ClsDonorCategories e = new ClsDonorCategories();
            e.Id = Convert.ToInt32("0");
            e.DonorTypes = "All";
            ClsCommon.lstDonorCategories.Add(e);
            ViewBag.donor = new SelectList(ClsCommon.lstDonorCategories.OrderBy(x => x.Id), "Id", "DonorTypes");
            //ViewData["Users"] = ClsCommon.lstUser;
            return ClsCommon.lstDonorCategories;

        }
        #endregion



        public ActionResult FundCollectionReport()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }
            ClsCommon.lstEchallanReport.Clear();
            GetUserList();
            return View();
        }


        public JsonResult Checkreport(string DonorId, string FromDate, string ToDate)
        {
            int intUserId = Convert.ToInt32(Session["UserId"]);
            DateTime frmdate = Convert.ToDateTime(FromDate);
            DateTime todate = Convert.ToDateTime(ToDate);
            int intdonortype = Convert.ToInt32(DonorId);
            try
            {
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    var reportlist = ObjEnty.sp_GetFundCollectionReport(intdonortype, frmdate, todate).ToList();

                    if (reportlist.Count() != 0)
                    {
                        //foreach (var f in reportlist)
                        //{
                        //    ClsCommon.LogHistory(f.Id, "PrintReceipt", intUserId);
                        //}
                        strStatusMsg = "Success";
                    }
                    else
                    {
                        strStatusMsg = "Error";
                    }
                }
                return Json(strStatusMsg, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public ActionResult ReportToPDF(string DonorId, string FromDate, string ToDate)
        {
            TableLogOnInfos crtableLogoninfos = new TableLogOnInfos();
            TableLogOnInfo crtableLogoninfo = new TableLogOnInfo();
            ConnectionInfo crConnectionInfo = new ConnectionInfo();
            PrintLayoutSettings PrintLayout = new PrintLayoutSettings();
            Tables CrTables;
            //CrystalDecisions.CrystalReports.Engine.Table CrTable;

            //string strsearchKey = Convert.ToString(ViewData["searchkey"]);

            ReportDocument rpt = new ReportDocument();

            DateTime frmdate = Convert.ToDateTime(FromDate);
            DateTime todate = Convert.ToDateTime(ToDate);
            int intdonortype = Convert.ToInt32(DonorId);

            try
            {
                int intId = Convert.ToInt32(Session["UserId"]);
                if (intId != 0)
                {
                    rpt.Load(Server.MapPath("~/ReportViewer/rptFundCollectionReport.rpt"));
                    rpt.SetParameterValue("@DonorType", intdonortype);
                    rpt.SetParameterValue("@FromDate", frmdate);
                    rpt.SetParameterValue("@ToDate", todate);
                    crConnectionInfo.ServerName = ConfigurationManager.AppSettings["DB_ServerName"].ToString();
                    crConnectionInfo.DatabaseName = ConfigurationManager.AppSettings["Database_Name"].ToString();
                    crConnectionInfo.UserID = ConfigurationManager.AppSettings["User_ID"].ToString();
                    crConnectionInfo.Password = ConfigurationManager.AppSettings["Password"].ToString();

                    CrTables = rpt.Database.Tables;
                    foreach (CrystalDecisions.CrystalReports.Engine.Table CrTable in CrTables)
                    {
                        crtableLogoninfo = CrTable.LogOnInfo;
                        crtableLogoninfo.ConnectionInfo = crConnectionInfo;
                        CrTable.ApplyLogOnInfo(crtableLogoninfo);
                    }
                    // PrintLayout.Scaling = PrintLayoutSettings.PrintScaling.DoNotScale;
                    //crvSaathii.ReportSource = rpt;
                    MemoryStream oStream = new MemoryStream(); // using System.IO           
                    // oStream = (MemoryStream)rpt.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                    CopyStream(rpt.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat), oStream);
                    Response.Clear();
                    Response.Buffer = true;
                    Response.ContentType = "application/pdf";
                    Response.BinaryWrite(oStream.ToArray());
                    Response.Flush();
                    //rpt.PrintToPrinter(PrintLayout);
                    rpt.Close();

                    return null;
                }

                else
                {
                    return RedirectToAction("Logintest", "Login");
                }

            }

            catch (Exception ex)
            {
                throw ex;
            }

            finally
            {
                if (rpt != null)
                {
                    rpt.Dispose();
                    rpt.Close();
                    rpt = null;
                }
            }
        }

        public ActionResult ReportToExcel(string DonorId, string FromDate, string ToDate)
        {
            TableLogOnInfos crtableLogoninfos = new TableLogOnInfos();
            TableLogOnInfo crtableLogoninfo = new TableLogOnInfo();
            ConnectionInfo crConnectionInfo = new ConnectionInfo();
            PrintLayoutSettings PrintLayout = new PrintLayoutSettings();
            Tables CrTables;
            //CrystalDecisions.CrystalReports.Engine.Table CrTable;

            //string strsearchKey = Convert.ToString(ViewData["searchkey"]);

            ReportDocument rpt = new ReportDocument();


            DateTime frmdate = Convert.ToDateTime(FromDate);
            DateTime todate = Convert.ToDateTime(ToDate);
            int intdonortype = Convert.ToInt32(DonorId);

            try
            {
                int intId = Convert.ToInt32(Session["UserId"]);
                if (intId != 0)
                {
                    rpt.Load(Server.MapPath("~/ReportViewer/rptFundCollectionReport.rpt"));
                    rpt.SetParameterValue("@DonorType", intdonortype);
                    rpt.SetParameterValue("@FromDate", frmdate);
                    rpt.SetParameterValue("@ToDate", todate);
                    crConnectionInfo.ServerName = ConfigurationManager.AppSettings["DB_ServerName"].ToString();
                    crConnectionInfo.DatabaseName = ConfigurationManager.AppSettings["Database_Name"].ToString();
                    crConnectionInfo.UserID = ConfigurationManager.AppSettings["User_ID"].ToString();
                    crConnectionInfo.Password = ConfigurationManager.AppSettings["Password"].ToString();

                    CrTables = rpt.Database.Tables;
                    foreach (CrystalDecisions.CrystalReports.Engine.Table CrTable in CrTables)
                    {
                        crtableLogoninfo = CrTable.LogOnInfo;
                        crtableLogoninfo.ConnectionInfo = crConnectionInfo;
                        CrTable.ApplyLogOnInfo(crtableLogoninfo);
                    }
                    // PrintLayout.Scaling = PrintLayoutSettings.PrintScaling.DoNotScale;
                    //crvSaathii.ReportSource = rpt;
                    MemoryStream oStream = new MemoryStream(); // using System.IO           
                    // oStream = (MemoryStream)rpt.ExportToStream(CrystalDecisions.Shared.ExportFormatType.Excel);
                    CopyStream(rpt.ExportToStream(CrystalDecisions.Shared.ExportFormatType.Excel), oStream);
                    Response.Clear();
                    Response.Buffer = true;
                    Response.ContentType = "application/xls";
                    Response.BinaryWrite(oStream.ToArray());
                    Response.Flush();
                    //rpt.PrintToPrinter(PrintLayout);

                    rpt.Close();

                    return null;
                }

                else
                {
                    return RedirectToAction("Logintest", "Login");
                }

            }

            catch (Exception ex)
            {
                throw ex;
            }

            finally
            {
                if (rpt != null)
                {
                    rpt.Dispose();
                    rpt.Close();
                    rpt = null;
                }
            }
        }


        #region-------------------Grid Search----------------------


        [HttpPost]
        public JsonResult Search(ClsEChallanReport obj)
        {
            try
            {
                ClsCommon.lstEchallanReport.Clear();
                DateTime frmdate = Convert.ToDateTime(obj.FromDate);
                DateTime todate = Convert.ToDateTime(obj.ToDate);
                int intdonortype = Convert.ToInt32(obj.DonorTypes);
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    if (intdonortype != 0 && obj.PaymentMode.Trim() != "All")
                    {
                        var echallanlist = (from p in ObjEnty.T_EChallan
                                            join c in ObjEnty.T_DONOR_CATEGORIES on p.Donation_Types equals c.Id

                                            where (p.Receipt_Date >= frmdate &&
                                            p.Receipt_Date <= todate &&
                                            p.Payment_Mode == obj.PaymentMode &&
                                            c.Id == intdonortype)


                                            select new
                                               {
                                                   p.Receipt_Number,
                                                   c.Donor_Types,
                                                   p.Account_Number,
                                                   p.Name_Of_Donor,
                                                   p.Address,
                                                   p.City,
                                                   p.Pincode,
                                                   p.Telephone_Number,
                                                   p.Mobile_Number,
                                                   p.Email_Id,
                                                   p.Payment_Mode,
                                                   p.PANcard_Number,
                                                   p.Amount,
                                                   p.DD_OR_Cheque_Number,
                                                   p.DD_OR_Cheque_Date,
                                                   p.Receipt_Date,
                                                   p.Created_Date


                                               }).ToList().OrderByDescending(p => p.Receipt_Date);

                        foreach (var i in echallanlist)
                        {
                            ClsEChallanReport objs = new ClsEChallanReport();
                            objs.Receipt_No = i.Receipt_Number;
                            objs.DonorTypes = i.Donor_Types;
                            objs.Account_No = i.Account_Number;
                            objs.Name_Of_Donor = i.Name_Of_Donor;
                            objs.Address = i.Address;
                            objs.City = i.City;
                            objs.Pincode = i.Pincode;
                            objs.Telephone = i.Telephone_Number;
                            objs.Mobile = i.Mobile_Number;
                            objs.Email = i.Email_Id;
                            objs.PaymentMode = i.Payment_Mode;
                            objs.PANcardNumber = i.PANcard_Number;
                            objs.Amount = i.Amount;
                            objs.strDDorChequeNumber = i.DD_OR_Cheque_Number;
                            objs.DDChequeDate = string.Format("{0:dd/MM/yyyy}", i.DD_OR_Cheque_Date);
                            objs.Receipt_Date = string.Format("{0:dd/MM/yyyy}", i.Receipt_Date);
                            objs.CreatedDate = string.Format("{0:dd/MM/yyyy}", i.Created_Date);
                            ClsCommon.lstEchallanReport.Add(objs);
                        }
                    }

                    else if (intdonortype != 0 && obj.PaymentMode.Trim() == "All")
                    {
                        var echallanlist = (from p in ObjEnty.T_EChallan
                                            join c in ObjEnty.T_DONOR_CATEGORIES on p.Donation_Types equals c.Id

                                            where (p.Receipt_Date >= frmdate &&
                                            p.Receipt_Date <= todate &&
                                            c.Id == intdonortype)


                                            select new
                                               {
                                                   p.Receipt_Number,
                                                   c.Donor_Types,
                                                   p.Account_Number,
                                                   p.Name_Of_Donor,
                                                   p.Address,
                                                   p.City,
                                                   p.Pincode,
                                                   p.Telephone_Number,
                                                   p.Mobile_Number,
                                                   p.Email_Id,
                                                   p.Payment_Mode,
                                                   p.PANcard_Number,
                                                   p.Amount,
                                                   p.DD_OR_Cheque_Number,
                                                   p.DD_OR_Cheque_Date,
                                                   p.Receipt_Date,
                                                   p.Created_Date


                                               }).ToList().OrderByDescending(p => p.Receipt_Date);

                        foreach (var i in echallanlist)
                        {
                            ClsEChallanReport objs = new ClsEChallanReport();
                            objs.Receipt_No = i.Receipt_Number;
                            objs.DonorTypes = i.Donor_Types;
                            objs.Account_No = i.Account_Number;
                            objs.Name_Of_Donor = i.Name_Of_Donor;
                            objs.Address = i.Address;
                            objs.City = i.City;
                            objs.Pincode = i.Pincode;
                            objs.Telephone = i.Telephone_Number;
                            objs.Mobile = i.Mobile_Number;
                            objs.Email = i.Email_Id;
                            objs.PaymentMode = i.Payment_Mode;
                            objs.PANcardNumber = i.PANcard_Number;
                            objs.Amount = i.Amount;
                            objs.strDDorChequeNumber = i.DD_OR_Cheque_Number;
                            objs.DDChequeDate = string.Format("{0:dd/MM/yyyy}", i.DD_OR_Cheque_Date);
                            objs.Receipt_Date = string.Format("{0:dd/MM/yyyy}", i.Receipt_Date);
                            objs.CreatedDate = string.Format("{0:dd/MM/yyyy}", i.Created_Date);
                            ClsCommon.lstEchallanReport.Add(objs);
                        }
                    }


                    else if (intdonortype == 0 && obj.PaymentMode.Trim() == "All")
                    {

                        var echallanlist = (from p in ObjEnty.T_EChallan
                                            join c in ObjEnty.T_DONOR_CATEGORIES on p.Donation_Types equals c.Id

                                            where (p.Receipt_Date >= frmdate &&
                                            p.Receipt_Date <= todate)



                                            select new
                                            {
                                                p.Receipt_Number,
                                                c.Donor_Types,
                                                p.Account_Number,
                                                p.Name_Of_Donor,
                                                p.Address,
                                                p.City,
                                                p.Pincode,
                                                p.Telephone_Number,
                                                p.Mobile_Number,
                                                p.Email_Id,
                                                p.Payment_Mode,
                                                p.PANcard_Number,
                                                p.Amount,
                                                p.DD_OR_Cheque_Number,
                                                p.DD_OR_Cheque_Date,
                                                p.Receipt_Date,
                                                p.Created_Date


                                            }).ToList().OrderByDescending(p => p.Receipt_Date);

                        foreach (var i in echallanlist)
                        {
                            ClsEChallanReport objs = new ClsEChallanReport();
                            objs.Receipt_No = i.Receipt_Number;
                            objs.DonorTypes = i.Donor_Types;
                            objs.Account_No = i.Account_Number;
                            objs.Name_Of_Donor = i.Name_Of_Donor;
                            objs.Address = i.Address;
                            objs.City = i.City;
                            objs.Pincode = i.Pincode;
                            objs.Telephone = i.Telephone_Number;
                            objs.Mobile = i.Mobile_Number;
                            objs.Email = i.Email_Id;
                            objs.PaymentMode = i.Payment_Mode;
                            objs.PANcardNumber = i.PANcard_Number;
                            objs.Amount = i.Amount;
                            objs.strDDorChequeNumber = i.DD_OR_Cheque_Number;
                            objs.DDChequeDate = string.Format("{0:dd/MM/yyyy}", i.DD_OR_Cheque_Date);
                            objs.Receipt_Date = string.Format("{0:dd/MM/yyyy}", i.Receipt_Date);
                            objs.CreatedDate = string.Format("{0:dd/MM/yyyy}", i.Created_Date);
                            ClsCommon.lstEchallanReport.Add(objs);
                        }

                    }


                    else if (intdonortype == 0 && obj.PaymentMode.Trim() != "All")
                    {

                        var echallanlist = (from p in ObjEnty.T_EChallan
                                            join c in ObjEnty.T_DONOR_CATEGORIES on p.Donation_Types equals c.Id

                                            where (p.Receipt_Date >= frmdate &&
                                            p.Payment_Mode == obj.PaymentMode &&
                                            p.Receipt_Date <= todate)



                                            select new
                                            {
                                                p.Receipt_Number,
                                                c.Donor_Types,
                                                p.Account_Number,
                                                p.Name_Of_Donor,
                                                p.Address,
                                                p.City,
                                                p.Pincode,
                                                p.Telephone_Number,
                                                p.Mobile_Number,
                                                p.Email_Id,
                                                p.Payment_Mode,
                                                p.PANcard_Number,
                                                p.Amount,
                                                p.DD_OR_Cheque_Number,
                                                p.DD_OR_Cheque_Date,
                                                p.Receipt_Date,
                                                p.Created_Date


                                            }).ToList().OrderByDescending(p => p.Receipt_Date);

                        foreach (var i in echallanlist)
                        {
                            ClsEChallanReport objs = new ClsEChallanReport();
                            objs.Receipt_No = i.Receipt_Number;
                            objs.DonorTypes = i.Donor_Types;
                            objs.Account_No = i.Account_Number;
                            objs.Name_Of_Donor = i.Name_Of_Donor;
                            objs.Address = i.Address;
                            objs.City = i.City;
                            objs.Pincode = i.Pincode;
                            objs.Telephone = i.Telephone_Number;
                            objs.Mobile = i.Mobile_Number;
                            objs.Email = i.Email_Id;
                            objs.PaymentMode = i.Payment_Mode;
                            objs.PANcardNumber = i.PANcard_Number;
                            objs.Amount = i.Amount;
                            objs.strDDorChequeNumber = i.DD_OR_Cheque_Number;
                            objs.DDChequeDate = string.Format("{0:dd/MM/yyyy}", i.DD_OR_Cheque_Date);
                            objs.Receipt_Date = string.Format("{0:dd/MM/yyyy}", i.Receipt_Date);
                            objs.CreatedDate = string.Format("{0:dd/MM/yyyy}", i.Created_Date);
                            ClsCommon.lstEchallanReport.Add(objs);
                        }


                    }

                    else
                    {

                        var echallanlist = (from p in ObjEnty.T_EChallan
                                            join c in ObjEnty.T_DONOR_CATEGORIES on p.Donation_Types equals c.Id

                                            where (p.Receipt_Date >= frmdate &&
                                            p.Receipt_Date <= todate)



                                            select new
                                            {
                                                p.Receipt_Number,
                                                c.Donor_Types,
                                                p.Account_Number,
                                                p.Name_Of_Donor,
                                                p.Address,
                                                p.City,
                                                p.Pincode,
                                                p.Telephone_Number,
                                                p.Mobile_Number,
                                                p.Email_Id,
                                                p.Payment_Mode,
                                                p.PANcard_Number,
                                                p.Amount,
                                                p.DD_OR_Cheque_Number,
                                                p.DD_OR_Cheque_Date,
                                                p.Receipt_Date,
                                                p.Created_Date


                                            }).ToList().OrderByDescending(p => p.Receipt_Date);

                        foreach (var i in echallanlist)
                        {
                            ClsEChallanReport objs = new ClsEChallanReport();
                            objs.Receipt_No = i.Receipt_Number;
                            objs.DonorTypes = i.Donor_Types;
                            objs.Account_No = i.Account_Number;
                            objs.Name_Of_Donor = i.Name_Of_Donor;
                            objs.Address = i.Address;
                            objs.City = i.City;
                            objs.Pincode = i.Pincode;
                            objs.Telephone = i.Telephone_Number;
                            objs.Mobile = i.Mobile_Number;
                            objs.Email = i.Email_Id;
                            objs.PaymentMode = i.Payment_Mode;
                            objs.PANcardNumber = i.PANcard_Number;
                            objs.Amount = i.Amount;
                            objs.strDDorChequeNumber = i.DD_OR_Cheque_Number;
                            objs.DDChequeDate = string.Format("{0:dd/MM/yyyy}", i.DD_OR_Cheque_Date);
                            objs.Receipt_Date = string.Format("{0:dd/MM/yyyy}", i.Receipt_Date);
                            objs.CreatedDate = string.Format("{0:dd/MM/yyyy}", i.Created_Date);
                            ClsCommon.lstEchallanReport.Add(objs);
                        }

                    }



                    if (ClsCommon.lstEchallanReport.Count == 0)
                    {
                        strStatusMsg = "No";
                        return Json(new { ClsCommon.lstEchallanReport, strStatusMsg }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        strStatusMsg = "";
                        return Json(new { ClsCommon.lstEchallanReport, strStatusMsg }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            // return Json(ClsCommon.lstEchallanReport, JsonRequestBehavior.AllowGet);
        }


        #endregion

        #region------------------ExportExcel-------------------------

        public FileResult ExportToExcel([DataSourceRequest]DataSourceRequest request)
        {
            List<string> lstFilterColumns = new List<string>() { "Id", "intDonartype", "dtDDChequeDate", "dtRecptDate", "FromDate", "strFromDate", "ToDate", "strToDate", "period", "CreatedDate" };

            //Return the result to the end user
            byte[] byteExport = ClsCommon.ToExport(lstGridEchallanReport, lstFilterColumns);

            return File(byteExport,   //The binary data of the XLS file
                 "application/vnd.ms-excel", //MIME type of Excel files
                 "EChallanExcelExport.xls");     //Suggested file name in the "Save as" dialog which will be displayed to the end user

        }


        #endregion

        #region "Methods"

        public ActionResult ReportGrid_Read([DataSourceRequest]DataSourceRequest request)
        {
            // GetReportList();
            try
            {

                ClsCommon.lstEchallanReport.Clear();
                //List<ClsEChallanReport> lstTempEchallanReport = new List<ClsEChallanReport>();
                DateTime frmdate = DateTime.Today;
                DateTime todate = DateTime.Today;
                // if (ClsCommon.lstEchallanReport.Count == 0)
                //   {
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {

                    var echallanlist = (from p in ObjEnty.T_EChallan
                                        join c in ObjEnty.T_DONOR_CATEGORIES on p.Donation_Types equals c.Id
                                        where (p.Receipt_Date >= frmdate &&
                                        p.Receipt_Date <= todate)
                                        select new
                                           {
                                               p.Receipt_Number,
                                               c.Donor_Types,
                                               p.Account_Number,
                                               p.Name_Of_Donor,
                                               p.Address,
                                               p.City,
                                               p.Pincode,
                                               p.Telephone_Number,
                                               p.Mobile_Number,
                                               p.Email_Id,
                                               p.Payment_Mode,
                                               p.PANcard_Number,
                                               p.Amount,
                                               p.DD_OR_Cheque_Number,
                                               p.DD_OR_Cheque_Date,
                                               p.Receipt_Date,
                                               p.Created_Date


                                           }).ToList().OrderByDescending(p => p.Receipt_Date);

                    foreach (var i in echallanlist)
                    {
                        ClsEChallanReport objs = new ClsEChallanReport();
                        objs.Receipt_No = i.Receipt_Number;
                        objs.DonorTypes = i.Donor_Types;
                        objs.Account_No = i.Account_Number;
                        objs.Name_Of_Donor = i.Name_Of_Donor;
                        objs.Address = i.Address;
                        objs.City = i.City;
                        objs.Pincode = i.Pincode;
                        objs.Telephone = i.Telephone_Number;
                        objs.Mobile = i.Mobile_Number;
                        objs.Email = i.Email_Id;
                        objs.PaymentMode = i.Payment_Mode;
                        objs.PANcardNumber = i.PANcard_Number;
                        objs.Amount = i.Amount;
                        objs.strDDorChequeNumber = i.DD_OR_Cheque_Number;
                        objs.DDChequeDate = string.Format("{0:dd/MM/yyyy}", i.DD_OR_Cheque_Date);
                        objs.Receipt_Date = string.Format("{0:dd/MM/yyyy}", i.Receipt_Date);
                        objs.CreatedDate = string.Format("{0:dd/MM/yyyy}", i.Created_Date);
                        ClsCommon.lstEchallanReport.Add(objs);
                    }
                    return Json(ClsCommon.lstEchallanReport, JsonRequestBehavior.AllowGet);
                }
                // }
                //  else
                //  {
                //  return Json(ClsCommon.lstEchallanReport.ToDataSourceResult(request));
                //  }

            }

            catch (Exception ex)
            {
                throw ex;
            }
        }


        #endregion



        #region CrystalReport new function

        protected static void CopyStream(Stream input, Stream output)
        {
            byte[] buffer = new byte[16 * 1024];
            int read;
            while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
            {
                output.Write(buffer, 0, read);
            }

        }


        #endregion



        //Karthick skd 22/05/2015
        #region----------Grid Read New-----------------


        public ActionResult Grid_Read([DataSourceRequest]DataSourceRequest request, int DonorTypes, string PaymentMode, string FromDate, string ToDate)
        {

            try
            {
                ClsCommon.lstEchallanReport.Clear();
                lstGridEchallanReport.Clear();
                DateTime frmdate = DateTime.Today;
                DateTime todate = DateTime.Today;
                int intdonortype = 0;
                //if (obj == null)
                //{
                //    ReportGrid_Read(null);

                //}
                // else
                //{

                if (FromDate == "" && ToDate == "")
                {
                    frmdate = DateTime.Today;
                    todate = DateTime.Today;
                }
                else
                {
                    frmdate = Convert.ToDateTime(FromDate);
                    todate = Convert.ToDateTime(ToDate);
                }
                intdonortype = Convert.ToInt32(DonorTypes);

                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    if (intdonortype != 0 && PaymentMode.Trim() != "All")
                    {
                        var echallanlist = (from p in ObjEnty.T_EChallan
                                            join c in ObjEnty.T_DONOR_CATEGORIES on p.Donation_Types equals c.Id

                                            where (p.Receipt_Date >= frmdate &&
                                            p.Receipt_Date <= todate &&
                                            p.Payment_Mode == PaymentMode &&
                                            c.Id == intdonortype)


                                            select new
                                            {
                                                p.Receipt_Number,
                                                c.Donor_Types,
                                                p.Account_Number,
                                                p.Name_Of_Donor,
                                                p.Address,
                                                p.City,
                                                p.Pincode,
                                                p.Telephone_Number,
                                                p.Mobile_Number,
                                                p.Email_Id,
                                                p.Payment_Mode,
                                                p.PANcard_Number,
                                                p.Amount,
                                                p.DD_OR_Cheque_Number,
                                                p.DD_OR_Cheque_Date,
                                                p.Receipt_Date,
                                                p.Created_Date


                                            }).ToList().OrderByDescending(p => p.Receipt_Date);

                        foreach (var i in echallanlist)
                        {
                            ClsEChallanReport objs = new ClsEChallanReport();
                            objs.Receipt_No = i.Receipt_Number;
                            objs.DonorTypes = i.Donor_Types;
                            objs.Account_No = i.Account_Number;
                            objs.Name_Of_Donor = i.Name_Of_Donor;
                            objs.Address = i.Address;
                            objs.City = i.City;
                            objs.Pincode = i.Pincode;
                            objs.Telephone = i.Telephone_Number;
                            objs.Mobile = i.Mobile_Number;
                            objs.Email = i.Email_Id;
                            objs.PaymentMode = i.Payment_Mode;
                            objs.PANcardNumber = i.PANcard_Number;
                            objs.Amount = i.Amount;
                            objs.strDDorChequeNumber = i.DD_OR_Cheque_Number;
                            objs.DDChequeDate = string.Format("{0:dd/MM/yyyy}", i.DD_OR_Cheque_Date);
                            objs.Receipt_Date = string.Format("{0:dd/MM/yyyy}", i.Receipt_Date);
                            objs.CreatedDate = string.Format("{0:dd/MM/yyyy}", i.Created_Date);
                            lstGridEchallanReport.Add(objs);
                        }
                    }

                    else if (intdonortype != 0 && PaymentMode.Trim() == "All")
                    {
                        var echallanlist = (from p in ObjEnty.T_EChallan
                                            join c in ObjEnty.T_DONOR_CATEGORIES on p.Donation_Types equals c.Id

                                            where (p.Receipt_Date >= frmdate &&
                                            p.Receipt_Date <= todate &&
                                            c.Id == intdonortype)


                                            select new
                                            {
                                                p.Receipt_Number,
                                                c.Donor_Types,
                                                p.Account_Number,
                                                p.Name_Of_Donor,
                                                p.Address,
                                                p.City,
                                                p.Pincode,
                                                p.Telephone_Number,
                                                p.Mobile_Number,
                                                p.Email_Id,
                                                p.Payment_Mode,
                                                p.PANcard_Number,
                                                p.Amount,
                                                p.DD_OR_Cheque_Number,
                                                p.DD_OR_Cheque_Date,
                                                p.Receipt_Date,
                                                p.Created_Date


                                            }).ToList().OrderByDescending(p => p.Receipt_Date);

                        foreach (var i in echallanlist)
                        {
                            ClsEChallanReport objs = new ClsEChallanReport();
                            objs.Receipt_No = i.Receipt_Number;
                            objs.DonorTypes = i.Donor_Types;
                            objs.Account_No = i.Account_Number;
                            objs.Name_Of_Donor = i.Name_Of_Donor;
                            objs.Address = i.Address;
                            objs.City = i.City;
                            objs.Pincode = i.Pincode;
                            objs.Telephone = i.Telephone_Number;
                            objs.Mobile = i.Mobile_Number;
                            objs.Email = i.Email_Id;
                            objs.PaymentMode = i.Payment_Mode;
                            objs.PANcardNumber = i.PANcard_Number;
                            objs.Amount = i.Amount;
                            objs.strDDorChequeNumber = i.DD_OR_Cheque_Number;
                            objs.DDChequeDate = string.Format("{0:dd/MM/yyyy}", i.DD_OR_Cheque_Date);
                            objs.Receipt_Date = string.Format("{0:dd/MM/yyyy}", i.Receipt_Date);
                            objs.CreatedDate = string.Format("{0:dd/MM/yyyy}", i.Created_Date);
                            lstGridEchallanReport.Add(objs);
                        }
                    }


                    else if (intdonortype == 0 && PaymentMode.Trim() == "All")
                    {

                        var echallanlist = (from p in ObjEnty.T_EChallan
                                            join c in ObjEnty.T_DONOR_CATEGORIES on p.Donation_Types equals c.Id

                                            where (p.Receipt_Date >= frmdate &&
                                            p.Receipt_Date <= todate)



                                            select new
                                            {
                                                p.Receipt_Number,
                                                c.Donor_Types,
                                                p.Account_Number,
                                                p.Name_Of_Donor,
                                                p.Address,
                                                p.City,
                                                p.Pincode,
                                                p.Telephone_Number,
                                                p.Mobile_Number,
                                                p.Email_Id,
                                                p.Payment_Mode,
                                                p.PANcard_Number,
                                                p.Amount,
                                                p.DD_OR_Cheque_Number,
                                                p.DD_OR_Cheque_Date,
                                                p.Receipt_Date,
                                                p.Created_Date


                                            }).ToList().OrderByDescending(p => p.Receipt_Date);

                        foreach (var i in echallanlist)
                        {
                            ClsEChallanReport objs = new ClsEChallanReport();
                            objs.Receipt_No = i.Receipt_Number;
                            objs.DonorTypes = i.Donor_Types;
                            objs.Account_No = i.Account_Number;
                            objs.Name_Of_Donor = i.Name_Of_Donor;
                            objs.Address = i.Address;
                            objs.City = i.City;
                            objs.Pincode = i.Pincode;
                            objs.Telephone = i.Telephone_Number;
                            objs.Mobile = i.Mobile_Number;
                            objs.Email = i.Email_Id;
                            objs.PaymentMode = i.Payment_Mode;
                            objs.PANcardNumber = i.PANcard_Number;
                            objs.Amount = i.Amount;
                            objs.strDDorChequeNumber = i.DD_OR_Cheque_Number;
                            objs.DDChequeDate = string.Format("{0:dd/MM/yyyy}", i.DD_OR_Cheque_Date);
                            objs.Receipt_Date = string.Format("{0:dd/MM/yyyy}", i.Receipt_Date);
                            objs.CreatedDate = string.Format("{0:dd/MM/yyyy}", i.Created_Date);
                            lstGridEchallanReport.Add(objs);
                        }

                    }


                    else if (intdonortype == 0 && PaymentMode.Trim() != "All")
                    {

                        var echallanlist = (from p in ObjEnty.T_EChallan
                                            join c in ObjEnty.T_DONOR_CATEGORIES on p.Donation_Types equals c.Id

                                            where (p.Receipt_Date >= frmdate &&
                                            p.Payment_Mode == PaymentMode &&
                                            p.Receipt_Date <= todate)



                                            select new
                                            {
                                                p.Receipt_Number,
                                                c.Donor_Types,
                                                p.Account_Number,
                                                p.Name_Of_Donor,
                                                p.Address,
                                                p.City,
                                                p.Pincode,
                                                p.Telephone_Number,
                                                p.Mobile_Number,
                                                p.Email_Id,
                                                p.Payment_Mode,
                                                p.PANcard_Number,
                                                p.Amount,
                                                p.DD_OR_Cheque_Number,
                                                p.DD_OR_Cheque_Date,
                                                p.Receipt_Date,
                                                p.Created_Date


                                            }).ToList().OrderByDescending(p => p.Receipt_Date);

                        foreach (var i in echallanlist)
                        {
                            ClsEChallanReport objs = new ClsEChallanReport();
                            objs.Receipt_No = i.Receipt_Number;
                            objs.DonorTypes = i.Donor_Types;
                            objs.Account_No = i.Account_Number;
                            objs.Name_Of_Donor = i.Name_Of_Donor;
                            objs.Address = i.Address;
                            objs.City = i.City;
                            objs.Pincode = i.Pincode;
                            objs.Telephone = i.Telephone_Number;
                            objs.Mobile = i.Mobile_Number;
                            objs.Email = i.Email_Id;
                            objs.PaymentMode = i.Payment_Mode;
                            objs.PANcardNumber = i.PANcard_Number;
                            objs.Amount = i.Amount;
                            objs.strDDorChequeNumber = i.DD_OR_Cheque_Number;
                            objs.DDChequeDate = string.Format("{0:dd/MM/yyyy}", i.DD_OR_Cheque_Date);
                            objs.Receipt_Date = string.Format("{0:dd/MM/yyyy}", i.Receipt_Date);
                            objs.CreatedDate = string.Format("{0:dd/MM/yyyy}", i.Created_Date);
                            lstGridEchallanReport.Add(objs);
                        }


                    }

                    else
                    {

                        var echallanlist = (from p in ObjEnty.T_EChallan
                                            join c in ObjEnty.T_DONOR_CATEGORIES on p.Donation_Types equals c.Id

                                            where (p.Receipt_Date >= frmdate &&
                                            p.Receipt_Date <= todate)



                                            select new
                                            {
                                                p.Receipt_Number,
                                                c.Donor_Types,
                                                p.Account_Number,
                                                p.Name_Of_Donor,
                                                p.Address,
                                                p.City,
                                                p.Pincode,
                                                p.Telephone_Number,
                                                p.Mobile_Number,
                                                p.Email_Id,
                                                p.Payment_Mode,
                                                p.PANcard_Number,
                                                p.Amount,
                                                p.DD_OR_Cheque_Number,
                                                p.DD_OR_Cheque_Date,
                                                p.Receipt_Date,
                                                p.Created_Date


                                            }).ToList().OrderByDescending(p => p.Receipt_Date);

                        foreach (var i in echallanlist)
                        {
                            ClsEChallanReport objs = new ClsEChallanReport();
                            objs.Receipt_No = i.Receipt_Number;
                            objs.DonorTypes = i.Donor_Types;
                            objs.Account_No = i.Account_Number;
                            objs.Name_Of_Donor = i.Name_Of_Donor;
                            objs.Address = i.Address;
                            objs.City = i.City;
                            objs.Pincode = i.Pincode;
                            objs.Telephone = i.Telephone_Number;
                            objs.Mobile = i.Mobile_Number;
                            objs.Email = i.Email_Id;
                            objs.PaymentMode = i.Payment_Mode;
                            objs.PANcardNumber = i.PANcard_Number;
                            objs.Amount = i.Amount;
                            objs.strDDorChequeNumber = i.DD_OR_Cheque_Number;
                            objs.DDChequeDate = string.Format("{0:dd/MM/yyyy}", i.DD_OR_Cheque_Date);
                            objs.Receipt_Date = string.Format("{0:dd/MM/yyyy}", i.Receipt_Date);
                            objs.CreatedDate = string.Format("{0:dd/MM/yyyy}", i.Created_Date);
                            lstGridEchallanReport.Add(objs);
                        }
                    }
                }
                //}

            }
            catch (Exception ex)
            {
                throw ex;
            }

            // decimal? dctotal=lstGridEchallanReport.Sum(x => x.Amount);
            //  ClsEChallanReport obj = new ClsEChallanReport();
            // obj.dctotamt = dctotal;
            // lstGridEchallanReport.Add(obj);
            return Json(lstGridEchallanReport.ToDataSourceResult(request));
        }



        #endregion



        #region Fund Collection Datewise

        public ActionResult FundCollectionDatewise()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }
            // fncFundReport();
            return View();
        }

        #endregion



        #region FundCollection Exporting to Excel

        public FileResult ExportToExcelDatewise(int intyear, string fromdate, string todate)
        {
            string strFileName = "";
            MemoryStream arrstrem = new MemoryStream();
            //List<string> lstFilterColumns = new List<string>()
            //    {
            //        "strStudentCode","strRollNumber","strStudentName","strGender","Community",
            //        "strAcademicYearName","strDivisionName","strClassName","strSectionName",
            //        "strPreferredContact","dtDOB"
            //    };


            arrstrem = Excel(intyear, fromdate, todate);
            // fncFundReport();
            return File(arrstrem.ToArray(), //The binary date of the excel file
               "application/vnd.ms-excel", // MIME type of Excel files
               strFileName);
        }

        public MemoryStream Excel(int intyear, string fromdate, string todate)
        {

            try
            {
                DateTime dtFromdate = Convert.ToDateTime(fromdate);
                DateTime dtTodate = Convert.ToDateTime(todate);
                var workbook = new HSSFWorkbook();
                //Create new Excel sheet
                var sheet = workbook.CreateSheet();
                int rowNumber = 1;
                ////(Optional) set the width of the columns

                ////Get all the properties
                PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);


                #region Cell Styles

                #region font

                var bold16font = workbook.CreateFont();
                bold16font.FontHeightInPoints = 12;
                bold16font.FontName = "Arial";
                bold16font.Boldweight = (short)FontBoldWeight.BOLD;

                var bold12font = workbook.CreateFont();
                bold12font.FontHeightInPoints = 8;
                bold12font.FontName = "Arial";
                bold12font.Boldweight = (short)FontBoldWeight.BOLD;

                var noraml12font = workbook.CreateFont();
                noraml12font.FontHeightInPoints = 8;
                noraml12font.FontName = "Arial";
                noraml12font.Boldweight = (short)FontBoldWeight.NORMAL;


                var colorfont = workbook.CreateFont();
                colorfont.FontHeightInPoints = 8;
                colorfont.FontName = "Arial";

                colorfont.Color = (short)(FontColor.RED);

                var colorAlignedCellStyle = workbook.CreateCellStyle();
                colorAlignedCellStyle.Alignment = HorizontalAlignment.CENTER;
                colorAlignedCellStyle.BorderTop = BorderStyle.THIN;
                colorAlignedCellStyle.BorderBottom = BorderStyle.THIN;
                colorAlignedCellStyle.BorderLeft = BorderStyle.THIN;
                colorAlignedCellStyle.BorderRight = BorderStyle.THIN;
                colorAlignedCellStyle.SetFont(colorfont);





                # endregion
                #region InstitutionLabel Cell Style
                var InstitutionLabelLabelCellStyle = workbook.CreateCellStyle();
                InstitutionLabelLabelCellStyle.Alignment = HorizontalAlignment.CENTER;
                InstitutionLabelLabelCellStyle.SetFont(bold16font);
                #endregion
                #region subtitile Cell Style
                var subTitleLabelCellStyle = workbook.CreateCellStyle();
                subTitleLabelCellStyle.Alignment = HorizontalAlignment.CENTER;
                subTitleLabelCellStyle.SetFont(bold12font);
                #endregion
                #region Right Cell Style
                var RightLabelCellStyle = workbook.CreateCellStyle();
                RightLabelCellStyle.Alignment = HorizontalAlignment.RIGHT;
                RightLabelCellStyle.SetFont(bold12font);
                #endregion
                #region HeaderLabel Cell Style
                var headerLabelCellStyle = workbook.CreateCellStyle();
                headerLabelCellStyle.Alignment = HorizontalAlignment.CENTER;
                headerLabelCellStyle.BorderTop = BorderStyle.THIN;
                headerLabelCellStyle.BorderBottom = BorderStyle.THIN;
                headerLabelCellStyle.BorderLeft = BorderStyle.THIN;
                headerLabelCellStyle.BorderRight = BorderStyle.THIN;
                //  headerLabelCellStyle.FillBackgroundColor = NPOI.HSSF.Util.HSSFColor.RED.index;
                headerLabelCellStyle.SetFont(bold12font);
                #endregion
                #region ResultLabel Cell Style
                var headerLabelCellStyle1 = workbook.CreateCellStyle();
                headerLabelCellStyle1.Alignment = HorizontalAlignment.CENTER;
                headerLabelCellStyle1.BorderTop = BorderStyle.THIN;
                headerLabelCellStyle1.BorderBottom = BorderStyle.THIN;
                headerLabelCellStyle1.BorderLeft = BorderStyle.THIN;
                headerLabelCellStyle1.BorderRight = BorderStyle.THIN;
                //  headerLabelCellStyle.FillBackgroundColor = NPOI.HSSF.Util.HSSFColor.RED.index;
                headerLabelCellStyle1.SetFont(noraml12font);
                #endregion
                #region RightAligned Cell Style
                var rightAlignedCellStyle = workbook.CreateCellStyle();
                rightAlignedCellStyle.Alignment = HorizontalAlignment.RIGHT;
                rightAlignedCellStyle.SetFont(noraml12font);
                #endregion
                #region LeftAligned Cell Style
                var leftAlignedCellStyle = workbook.CreateCellStyle();
                leftAlignedCellStyle.Alignment = HorizontalAlignment.LEFT;
                leftAlignedCellStyle.BorderTop = BorderStyle.THIN;
                leftAlignedCellStyle.BorderBottom = BorderStyle.THIN;
                leftAlignedCellStyle.BorderLeft = BorderStyle.THIN;
                leftAlignedCellStyle.BorderRight = BorderStyle.THIN;
                leftAlignedCellStyle.SetFont(noraml12font);
                #endregion
                #region LeftAligned Cell Style
                var leftAlignedCellStyle1 = workbook.CreateCellStyle();
                leftAlignedCellStyle1.Alignment = HorizontalAlignment.LEFT;
                //leftAlignedCellStyle1.BorderTop = BorderStyle.THIN;
                //leftAlignedCellStyle1.BorderBottom = BorderStyle.THIN;
                //leftAlignedCellStyle1.BorderLeft = BorderStyle.THIN;
                //leftAlignedCellStyle1.BorderRight = BorderStyle.THIN;
                leftAlignedCellStyle1.SetFont(bold12font);
                #endregion
                #region Currency Cell Style
                var currencyCellStyle = workbook.CreateCellStyle();
                currencyCellStyle.Alignment = HorizontalAlignment.RIGHT;
                var formatId = HSSFDataFormat.GetBuiltinFormat("$#,##0.00");
                if (formatId == -1)
                {
                    var newDataFormat = workbook.CreateDataFormat();
                    currencyCellStyle.DataFormat = newDataFormat.GetFormat("$#,##0.00");
                }
                else
                    currencyCellStyle.DataFormat = formatId;
                #endregion
                #region Detail Subtotal Style
                var detailSubtotalCellStyle = workbook.CreateCellStyle();
                detailSubtotalCellStyle.BorderTop = BorderStyle.THIN;
                detailSubtotalCellStyle.BorderBottom = BorderStyle.THIN;
                var detailSubtotalFont = workbook.CreateFont();
                detailSubtotalFont.Boldweight = (short)FontBoldWeight.BOLD;
                detailSubtotalCellStyle.SetFont(detailSubtotalFont);
                #endregion
                #region Detail Currency Subtotal Style
                var detailCurrencySubtotalCellStyle = workbook.CreateCellStyle();
                detailCurrencySubtotalCellStyle.BorderTop = BorderStyle.THIN;
                detailCurrencySubtotalCellStyle.BorderBottom = BorderStyle.THIN;
                var detailCurrencySubtotalFont = workbook.CreateFont();
                detailCurrencySubtotalFont.Boldweight = (short)FontBoldWeight.BOLD;
                detailCurrencySubtotalCellStyle.SetFont(detailCurrencySubtotalFont);
                formatId = HSSFDataFormat.GetBuiltinFormat("$#,##0.00");
                if (formatId == -1)
                {
                    var newDataFormat = workbook.CreateDataFormat();
                    detailCurrencySubtotalCellStyle.DataFormat = newDataFormat.GetFormat("$#,##0.00");
                }
                else
                    detailCurrencySubtotalCellStyle.DataFormat = formatId;
                #endregion
                #endregion

                using (SaiAramFoundationEntities dbContext = new SaiAramFoundationEntities())
                {
                    //Create a header row
                    List<ClsEChallan> lstEChallan = new List<ClsEChallan>();
                    ClsEChallan clsH = new ClsEChallan();

                    var donortypes = (from c in dbContext.T_DONOR_CATEGORIES
                                      where c.Is_Active == true && c.Is_Deleted==false
                                      select new
                                      {
                                          c.Donor_Types
                                      }).Distinct().OrderBy(x => x.Donor_Types).ToList();


                    var lstReceiptdate = dbContext.T_EChallan.Where(q => q.Receipt_Date != null && (q.Receipt_Date >= dtFromdate && q.Receipt_Date <= dtTodate))
                                         .GroupBy(g => g.Receipt_Date).OrderBy(x => x.Key).Select(x => x.Key).ToList();


                  
                    IRow headerRow = sheet.CreateRow(rowNumber);
                    ICell cell = headerRow.CreateCell(2);
                    cell.SetCellValue("Fund Collection from " + fromdate + " to " + todate);
                    cell.CellStyle = InstitutionLabelLabelCellStyle;
                    var craClsheading = new CellRangeAddress(rowNumber, rowNumber, 2, 9);
                    sheet.AddMergedRegion(craClsheading);
                    CellRangeAddress region = new CellRangeAddress(rowNumber, rowNumber, 2, 5);


                    rowNumber++;
                    //  Set the column names in the header row
                    headerRow = sheet.CreateRow(rowNumber);


                    rowNumber++;
                    headerRow = sheet.CreateRow(rowNumber);
                    cell = headerRow.CreateCell(1);
                    cell.SetCellValue("Date");
                    cell.CellStyle = headerLabelCellStyle;
                    var craClsDate = new CellRangeAddress(rowNumber, rowNumber + 2, 1, 1);
                    sheet.AddMergedRegion(craClsDate);
                    cell.CellStyle.Alignment = HorizontalAlignment.CENTER;
                    cell.CellStyle.VerticalAlignment = VerticalAlignment.CENTER;
                    cell.CellStyle.BorderBottom = BorderStyle.THIN;
                    cell.CellStyle.BorderLeft = BorderStyle.THIN;
                    cell.CellStyle.BorderTop = BorderStyle.THIN;
                    cell.CellStyle.BorderRight = BorderStyle.THIN;


                    cell = headerRow.CreateCell(2);
                    cell.SetCellValue("Mode of payment - Cash");
                    cell.CellStyle = headerLabelCellStyle;
                    var craClscash = new CellRangeAddress(rowNumber, rowNumber + 1, 2, donortypes.Count() + 2);
                    sheet.AddMergedRegion(craClscash);
                    cell.CellStyle.Alignment = HorizontalAlignment.CENTER;
                    cell.CellStyle.VerticalAlignment = VerticalAlignment.CENTER;
                    cell.CellStyle.BorderBottom = BorderStyle.THIN;
                    cell.CellStyle.BorderLeft = BorderStyle.THIN;
                    cell.CellStyle.BorderTop = BorderStyle.THIN;
                    cell.CellStyle.BorderRight = BorderStyle.THIN;

                    int DDStartcell = donortypes.Count() + 3;
                    int DDendcell = donortypes.Count() + 3 + donortypes.Count();

                    cell = headerRow.CreateCell(DDStartcell);
                    cell.SetCellValue("Mode of payment - DD/Cheque");
                    cell.CellStyle = headerLabelCellStyle;
                    var craClsDD = new CellRangeAddress(rowNumber, rowNumber + 1, DDStartcell, DDendcell);
                    sheet.AddMergedRegion(craClsDD);
                    cell.CellStyle.Alignment = HorizontalAlignment.CENTER;
                    cell.CellStyle.VerticalAlignment = VerticalAlignment.CENTER;
                    cell.CellStyle.BorderBottom = BorderStyle.THIN;
                    cell.CellStyle.BorderLeft = BorderStyle.THIN;
                    cell.CellStyle.BorderTop = BorderStyle.THIN;
                    cell.CellStyle.BorderRight = BorderStyle.THIN;


                    cell = headerRow.CreateCell(DDendcell + 1);
                    cell.SetCellValue("Grant Total");
                    cell.CellStyle = headerLabelCellStyle;
                    var craClsGranttotal = new CellRangeAddress(rowNumber, rowNumber + 1, DDendcell + 1, DDendcell + 1);
                    sheet.AddMergedRegion(craClsGranttotal);
                    cell.CellStyle.Alignment = HorizontalAlignment.CENTER;
                    cell.CellStyle.VerticalAlignment = VerticalAlignment.CENTER;
                    cell.CellStyle.BorderBottom = BorderStyle.THIN;
                    cell.CellStyle.BorderLeft = BorderStyle.THIN;
                    cell.CellStyle.BorderTop = BorderStyle.THIN;
                    cell.CellStyle.BorderRight = BorderStyle.THIN;




                    // Binding dynamic funds and Total according to cash
                    headerRow = sheet.CreateRow(5);
                    int cellCountCash = 2;
                    foreach (var i in donortypes)
                    {
                        cell = headerRow.CreateCell(cellCountCash);
                        cell.SetCellValue(i.Donor_Types.Trim());
                        cell.CellStyle = headerLabelCellStyle;
                        cell.CellStyle.WrapText = true;
                        //var craClsdynamicfunds = new CellRangeAddress(4, 4, cellCountCash, cellCountCash);
                        //sheet.AddMergedRegion(craClsdynamicfunds);
                        cell.CellStyle.Alignment = HorizontalAlignment.CENTER;
                        cell.CellStyle.VerticalAlignment = VerticalAlignment.CENTER;
                        cell.CellStyle.BorderBottom = BorderStyle.THIN;
                        cell.CellStyle.BorderLeft = BorderStyle.THIN;
                        cell.CellStyle.BorderTop = BorderStyle.THIN;
                        cell.CellStyle.BorderRight = BorderStyle.THIN;
                        cellCountCash++;
                    }

                    cell = headerRow.CreateCell(cellCountCash);
                    cell.SetCellValue("Total");
                    cell.CellStyle = headerLabelCellStyle;
                    //var craClsdynamicfunds = new CellRangeAddress(rowNumber, rowNumber + 2, 1, 1);
                    //sheet.AddMergedRegion(craClsdynamicfunds);
                    cell.CellStyle.Alignment = HorizontalAlignment.CENTER;
                    cell.CellStyle.VerticalAlignment = VerticalAlignment.CENTER;
                    cell.CellStyle.BorderBottom = BorderStyle.THIN;
                    cell.CellStyle.BorderLeft = BorderStyle.THIN;
                    cell.CellStyle.BorderTop = BorderStyle.THIN;
                    cell.CellStyle.BorderRight = BorderStyle.THIN;
                    cellCountCash++;


                    // Binding dynamic funds and Total according to DD

                    foreach (var i in donortypes)
                    {
                        cell = headerRow.CreateCell(cellCountCash);
                        cell.SetCellValue(i.Donor_Types.Trim());
                        cell.CellStyle = headerLabelCellStyle;
                        cell.CellStyle.WrapText = true;
                        //var craClsdynamicfunds = new CellRangeAddress(4, 4, cellCountCash, cellCountCash);
                        //sheet.AddMergedRegion(craClsdynamicfunds);
                        cell.CellStyle.Alignment = HorizontalAlignment.CENTER;
                        cell.CellStyle.VerticalAlignment = VerticalAlignment.CENTER;
                        cell.CellStyle.BorderBottom = BorderStyle.THIN;
                        cell.CellStyle.BorderLeft = BorderStyle.THIN;
                        cell.CellStyle.BorderTop = BorderStyle.THIN;
                        cell.CellStyle.BorderRight = BorderStyle.THIN;
                        cellCountCash++;
                    }

                    cell = headerRow.CreateCell(cellCountCash);
                    cell.SetCellValue("Total");
                    cell.CellStyle = headerLabelCellStyle;
                    //var craClsdynamicfunds = new CellRangeAddress(rowNumber, rowNumber + 2, 1, 1);
                    //sheet.AddMergedRegion(craClsdynamicfunds);
                    cell.CellStyle.Alignment = HorizontalAlignment.CENTER;
                    cell.CellStyle.VerticalAlignment = VerticalAlignment.CENTER;
                    cell.CellStyle.BorderBottom = BorderStyle.THIN;
                    cell.CellStyle.BorderLeft = BorderStyle.THIN;
                    cell.CellStyle.BorderTop = BorderStyle.THIN;
                    cell.CellStyle.BorderRight = BorderStyle.THIN;


                    using (SqlConnection con = new SqlConnection(StrConnectionString))
                    {
                        using (SqlCommand comm = new SqlCommand("sp_GetCashDatewise", con))
                        {
                            if (con.State == ConnectionState.Closed)
                            {
                                con.Open();
                            }
                            comm.CommandType = CommandType.StoredProcedure;
                            //comm.Parameters.AddWithValue("@Fromdate", fromdate);
                            //comm.Parameters.AddWithValue("@Todate", todate);
                            da = new SqlDataAdapter(comm);
                            //da.Fill(ds);
                            da.Fill(dtCash);
                        }

                        da.Dispose();
                        da = null;
                        using (SqlCommand comm = new SqlCommand("sp_GetDDChequeDatewise", con))
                        {

                            comm.CommandType = CommandType.StoredProcedure;
                            //comm.Parameters.AddWithValue("@Fromdate", fromdate);
                            //comm.Parameters.AddWithValue("@Todate", todate);
                            da = new SqlDataAdapter(comm);
                            //da.Fill(ds);
                            da.Fill(dtDD);
                        }

                        string strReceiptdatelst = "";
                        string stramount = "";

                        rowNumber = 5;
                        int cellcashamt = 1;
                        int cellddamt = donortypes.Count() + 2;
                        decimal dcgranttot = 0;
                        decimal cashtotal = 0;
                        decimal ddtotal = 0;
                        foreach (var v in lstReceiptdate)
                        {
                            cellcashamt = 1;
                            cellddamt = donortypes.Count() + 2;
                            dcgranttot = 0;
                            cashtotal = 0;
                            ddtotal = 0;
                            strReceiptdatelst = Convert.ToDateTime(v.Value).ToShortDateString();
                            rowNumber++;
                            //  Set the column names in the header row
                            headerRow = sheet.CreateRow(rowNumber);
                            cell = headerRow.CreateCell(1);
                            cell.SetCellValue(strReceiptdatelst);
                            cell.CellStyle = headerLabelCellStyle;
                            //var craClsDate = new CellRangeAddress(rowNumber, rowNumber + 2, 1, 1);
                            //sheet.AddMergedRegion(craClsDate);
                            cell.CellStyle.Alignment = HorizontalAlignment.CENTER;
                            cell.CellStyle.VerticalAlignment = VerticalAlignment.CENTER;
                            cell.CellStyle.BorderBottom = BorderStyle.THIN;
                            cell.CellStyle.BorderLeft = BorderStyle.THIN;
                            cell.CellStyle.BorderTop = BorderStyle.THIN;
                            cell.CellStyle.BorderRight = BorderStyle.THIN;


                            foreach (DataRow row in dtCash.Rows)
                            {
                                if (strReceiptdatelst.Trim() == row.ItemArray[0].ToString().Trim())
                                {
                                    int z = 0;
                                    for (int a = 0; a < donortypes.Count; a++)
                                    {
                                        z++;
                                        cellcashamt++;
                                        cell = headerRow.CreateCell(cellcashamt);
                                        cell.SetCellValue(row.ItemArray[z].ToString());
                                        cell.CellStyle = headerLabelCellStyle;
                                        //var craClsdynamicfunds = new CellRangeAddress(rowNumber, rowNumber + 2, 1, 1);
                                        //sheet.AddMergedRegion(craClsdynamicfunds);
                                        cell.CellStyle.Alignment = HorizontalAlignment.CENTER;
                                        cell.CellStyle.VerticalAlignment = VerticalAlignment.CENTER;
                                        cell.CellStyle.BorderBottom = BorderStyle.THIN;
                                        cell.CellStyle.BorderLeft = BorderStyle.THIN;
                                        cell.CellStyle.BorderTop = BorderStyle.THIN;
                                        cell.CellStyle.BorderRight = BorderStyle.THIN;
                                        if (row.ItemArray[z].ToString() != "")
                                        {
                                            cashtotal = cashtotal + Convert.ToDecimal(row.ItemArray[z].ToString());
                                        }
                                    }
                                    cellcashamt++;
                                    cell = headerRow.CreateCell(cellcashamt);
                                    cell.SetCellValue(cashtotal.ToString());
                                    cell.CellStyle = headerLabelCellStyle;
                                    //var craClsdynamicfunds = new CellRangeAddress(rowNumber, rowNumber + 2, 1, 1);
                                    //sheet.AddMergedRegion(craClsdynamicfunds);
                                    cell.CellStyle.Alignment = HorizontalAlignment.CENTER;
                                    cell.CellStyle.VerticalAlignment = VerticalAlignment.CENTER;
                                    cell.CellStyle.BorderBottom = BorderStyle.THIN;
                                    cell.CellStyle.BorderLeft = BorderStyle.THIN;
                                    cell.CellStyle.BorderTop = BorderStyle.THIN;
                                    cell.CellStyle.BorderRight = BorderStyle.THIN;
                                    break;
                                }
                            }


                            foreach (DataRow row in dtDD.Rows)
                            {
                                if (strReceiptdatelst.Trim() == row.ItemArray[0].ToString().Trim())
                                {
                                    int j = 0;

                                    for (int b = 0; b < donortypes.Count; b++)
                                    {
                                        j++;
                                        cellddamt++;
                                        cell = headerRow.CreateCell(cellddamt);
                                        cell.SetCellValue(row.ItemArray[j].ToString());
                                        cell.CellStyle = headerLabelCellStyle;
                                        //var craClsdynamicfunds = new CellRangeAddress(rowNumber, rowNumber + 2, 1, 1);
                                        //sheet.AddMergedRegion(craClsdynamicfunds);
                                        cell.CellStyle.Alignment = HorizontalAlignment.CENTER;
                                        cell.CellStyle.VerticalAlignment = VerticalAlignment.CENTER;
                                        cell.CellStyle.BorderBottom = BorderStyle.THIN;
                                        cell.CellStyle.BorderLeft = BorderStyle.THIN;
                                        cell.CellStyle.BorderTop = BorderStyle.THIN;
                                        cell.CellStyle.BorderRight = BorderStyle.THIN;
                                        if (row.ItemArray[j].ToString() != "")
                                        {
                                            ddtotal = ddtotal + Convert.ToDecimal(row.ItemArray[j].ToString());
                                        }
                                    }
                                    cellddamt++;
                                    cell = headerRow.CreateCell(cellddamt);
                                    cell.SetCellValue(ddtotal.ToString());
                                    cell.CellStyle = headerLabelCellStyle;
                                    //var craClsdynamicfunds = new CellRangeAddress(rowNumber, rowNumber + 2, 1, 1);
                                    //sheet.AddMergedRegion(craClsdynamicfunds);
                                    cell.CellStyle.Alignment = HorizontalAlignment.CENTER;
                                    cell.CellStyle.VerticalAlignment = VerticalAlignment.CENTER;
                                    cell.CellStyle.BorderBottom = BorderStyle.THIN;
                                    cell.CellStyle.BorderLeft = BorderStyle.THIN;
                                    cell.CellStyle.BorderTop = BorderStyle.THIN;
                                    cell.CellStyle.BorderRight = BorderStyle.THIN;
                                    break;
                                }
                            }

                            dcgranttot = cashtotal + ddtotal;
                            cell = headerRow.CreateCell(DDendcell + 1);
                            cell.SetCellValue(dcgranttot.ToString());
                            cell.CellStyle = headerLabelCellStyle;
                            //var craClsdynamicfunds = new CellRangeAddress(rowNumber, rowNumber + 2, 1, 1);
                            //sheet.AddMergedRegion(craClsdynamicfunds);
                            cell.CellStyle.Alignment = HorizontalAlignment.CENTER;
                            cell.CellStyle.VerticalAlignment = VerticalAlignment.CENTER;
                            cell.CellStyle.BorderBottom = BorderStyle.THIN;
                            cell.CellStyle.BorderLeft = BorderStyle.THIN;
                            cell.CellStyle.BorderTop = BorderStyle.THIN;
                            cell.CellStyle.BorderRight = BorderStyle.THIN;

                        }


                        //List<DataRow> drlist = new List<DataRow>();

                        //foreach (DataRow row in dt.Rows)
                        //{
                        //    drlist.Add((DataRow)row);
                        //}




                        // var s = drlist.Where(x => x.ItemArray[0].ToString() == dtFromdate);

                    }
                    // Binding data
                    //DateTime dtFromtime=Convert.ToDateTime(fromdate);
                    //DateTime dtTotime=Convert.ToDateTime(todate);

                    //var lstfundcollection = (from f in dbContext.T_EChallan
                    //                         join d in dbContext.T_DONOR_CATEGORIES on f.Donation_Types equals d.Id
                    //                         where (f.Receipt_Date >= dtFromtime && f.Receipt_Date <= dtTotime) && d.Is_Active == true
                    //                         select new 
                    //                         {
                    //                             f.Receipt_Date,
                    //                             f.Amount,
                    //                             d.Donor_Types,
                    //                             f.Payment_Mode
                    //                         }).OrderBy(x=>x.Receipt_Date).GroupBy(b=>new{b.Receipt_Date,b.Payment_Mode}).ToList();

                    //var lstGrpByPayMod = lstfundcollection.Select(b => new
                    //{
                    //    date=b.Select(t=>t.Receipt_Date).FirstOrDefault(),
                    //    payByCash = b.Where(t => t.Payment_Mode.Trim().ToUpper() == "CASH").ToList(),
                    //    payByOthers = b.Where(t => t.Payment_Mode.Trim().ToUpper() != "CASH").ToList()
                    //}).ToList();

                    //lstGrpByPayMod.ForEach(t =>
                    //{
                    //    ClsEChallan obj = new ClsEChallan();

                    //    obj.strRecptDate=Convert.ToDateTime(t.date).ToShortDateString();
                    //    //obj.dictValues.Add("Mode of payment - Cash",);
                    //    List<string[]> lstStrArr=new List<string[]>();
                    //    foreach (var item in t.payByCash.GroupBy(b=>b.Donor_Types).ToList())
                    //    {
                    //        string[] strArr = {item.Key,Convert.ToString(item.Sum(l=>l.Amount)) };
                    //        lstStrArr.Add(strArr);
                    //    }
                    //    obj.dictCashValues.Add("Mode of payment - Cash", lstStrArr);

                    //    lstStrArr = new List<string[]>();
                    //    foreach (var item in t.payByOthers.GroupBy(b => b.Donor_Types).ToList())
                    //    {
                    //        string[] strArr = { item.Key, Convert.ToString(item.Sum(l => l.Amount)) };
                    //        lstStrArr.Add(strArr);
                    //    }
                    //    obj.dictOtherValues.Add("Mode of payment - DD", lstStrArr);

                    //    lstEChallan.Add(obj);
                    //});





                    MemoryStream output = new MemoryStream();
                    workbook.Write(output);
                    return output;



                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
           
            //Create new Excel workbook
          
        }




        #endregion


    }
}
