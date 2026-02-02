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
using System.Web.UI.WebControls;
using System.Web.UI;
using iTextSharp.text.pdf;
using iTextSharp.text;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
//using System.Web.UI.WebControls;
//using ReportManagement;



namespace E_Challan.Controllers
{


    public class PrintReceiptController : Controller
    {

        public string strStatusMsg = "";
        Database db = null;

        #region"------------------------ Report for Receipt--------------"

        public ActionResult PrintReceipt()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }
            ClsCommon.lstEchallan.Clear();
            return View();
        }

        public ActionResult DatewiseReceipt()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }
            ClsCommon.lstEchallan.Clear();
            return View();
        }

        public ActionResult TestPrintReceipt()
        {
            ClsEChallan model = new ClsEChallan();
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }
            ClsCommon.lstEchallan.Clear();

            int intCount = 0;
            int intHeadingCount = 0;
            decimal? totalAmount = 0;
            decimal? TempTotalAmount = 0;
            int intDonorTypeCount = 0;
            int intTempColumCount = 0;
            //decimal? ColoumtotalAmount = 0;
            List<ClsEChallan> lstTempHeader = new List<ClsEChallan>();
            List<ClsEChallan> lstTempBelowHeader = new List<ClsEChallan>();
            List<ClsEChallan> lstTempDateCount = new List<ClsEChallan>();

            using (SaiAramFoundationEntities dbcontext = new SaiAramFoundationEntities())
            {
                ClsEChallan clsH = new ClsEChallan();
                var s = (from f in dbcontext.T_EChallan
                         join c in dbcontext.T_DONOR_CATEGORIES on f.Donation_Types equals c.Id
                         where c.Is_Active == true
                         select new
                         {
                             c.Donor_Types
                         }).Distinct().ToList();

                foreach (var i in s)
                {
                    ClsEChallan cls = new ClsEChallan();
                    cls.DonorTypes = i.Donor_Types;
                    intHeadingCount = intHeadingCount + 1;
                    cls.chkHeaderCount = intHeadingCount;
                    lstTempHeader.Add(cls);
                }
                clsH.DonorTypes = "Total";
                clsH.chkHeaderCount = intHeadingCount + 1;
                lstTempHeader.Add(clsH);


                var Date = dbcontext.sp_FundCollection_DateOnly().ToList().OrderBy(x => x.Receipt_Date);

                lstTempDateCount = (from T in Date
                                    select new ClsEChallan
                                    {
                                        strRecptDate = string.Format("{0:dd/MM/yyyy}", T.Receipt_Date)
                                    }).ToList();

                foreach (var k in Date)
                {
                    ClsEChallan clsobj = new ClsEChallan();
                    DateTime? ReceiptDate = k.Receipt_Date;


                    var DonerType = (from f in dbcontext.T_EChallan
                                     join c in dbcontext.T_DONOR_CATEGORIES on f.Donation_Types equals c.Id
                                     where c.Is_Active == true
                                     select new
                                     {
                                         c.Donor_Types
                                     }).Distinct().ToList();
                    intCount = intCount + 1;

                    totalAmount = 0;
                    intDonorTypeCount = DonerType.Count();
                    intTempColumCount = 0;
                    foreach (var i in DonerType)
                    {
                        ClsEChallan cls = new ClsEChallan();
                        cls.DonorTypes = i.Donor_Types;
                        var D = dbcontext.sp_FundCollection_Below().ToList().OrderBy(x => x.Receipt_Date);
                        foreach (var j in D)
                        {
                            ClsEChallan obj = new ClsEChallan();
                            ClsEChallan objexist = new ClsEChallan();
                            if (cls.DonorTypes == j.Donor_Types && ReceiptDate == j.Receipt_Date)
                            {
                                intTempColumCount = intTempColumCount + 1;
                                obj.srtRecptDate = string.Format("{0:dd/MM/yyyy}", j.Receipt_Date);
                                obj.strRecptNo = j.Receipt_Number;
                                obj.decAmount = j.Amount;
                                totalAmount = j.Amount + totalAmount;
                                obj.RowTotal = totalAmount;
                                obj.chkCount = intCount;
                                obj.intColumCount = intTempColumCount;
                                obj.DonerTypeCount = intDonorTypeCount;
                                obj.DonorTypes = j.Donor_Types;
                                lstTempBelowHeader.Add(obj);
                                break;
                            }
                        }

                    }
                }
            }




            List<ClsEChallan> lstTempGrandTotal = (from a in lstTempBelowHeader
                                                   group a by a.DonorTypes into grp
                                                   select new ClsEChallan
                                                   {
                                                       DonorTypes = grp.FirstOrDefault().DonorTypes,
                                                       ColoumTotal = grp.Sum(x => x.decAmount)
                                                   }).ToList();
            decimal? TempGrandTotal = 0;
            int GrandTotalCount = 0;

            foreach (var item in lstTempGrandTotal)
            {
                TempGrandTotal = TempGrandTotal + item.ColoumTotal;
                GrandTotalCount = GrandTotalCount + 1;

            }

            lstTempGrandTotal.ForEach(x => { x.GrandTotal = TempGrandTotal; x.chkGrantTotalCount = GrandTotalCount; });

            model.lstHeader = lstTempHeader;
            model.lstBelowHeader = lstTempBelowHeader.OrderBy(x => x.srtRecptDate).ToList();
            model.lstGrandTotal = lstTempGrandTotal;
            model.lstDateCount = lstTempDateCount;

            return View(model);
        }

        [HttpPost]
        public ActionResult TestPrintReceipt(ClsEChallan ClsObj)
        {

            return View();
        }

        public ActionResult ExportToExcel()
        {
            var texts = new System.Data.DataTable("teste");

            var grid = new GridView();
            grid.DataSource = texts;
            grid.DataBind();

            Response.ClearContent();
            Response.Buffer = true;
            Response.AddHeader("content-disposition", "attachment; filename=MyExcelFile.xls");
            Response.ContentType = "application/ms-excel";

            Response.Charset = "";
            StringWriter sw = new StringWriter();
            HtmlTextWriter htw = new HtmlTextWriter(sw);

            // rendering grid
            grid.RenderControl(htw);

            Response.Output.Write(sw.ToString());
            Response.Flush();
            Response.End();

            return View("TestPrintReceipt");
        }

        public void ExportResults(string html)
        {

            Response.Clear();
            Response.ContentType = "text/csv";
            Response.AddHeader("Content-Disposition", "attachment; filename=TheReport.csv");
            Response.Flush();
            Response.Write(html);
            Response.End();

        }

        [HttpPost]
        public ActionResult PrintReceipt(ClsEChallan obj)
        {
            using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
            {
                var reportlist = ObjEnty.sp_GetReceiptDt(obj.SearchKey).ToList();
                if (reportlist.Count != 0)
                {
                    Report(obj.SearchKey);
                }
                else
                {
                    strStatusMsg = "Error";
                }
            }
            return View(obj);
        }

        public ActionResult Report(string strId)
        {
            TableLogOnInfos crtableLogoninfos = new TableLogOnInfos();
            TableLogOnInfo crtableLogoninfo = new TableLogOnInfo();
            ConnectionInfo crConnectionInfo = new ConnectionInfo();
            PrintLayoutSettings PrintLayout = new PrintLayoutSettings();
            Tables CrTables;
            //CrystalDecisions.CrystalReports.Engine.Table CrTable;

            //string strsearchKey = Convert.ToString(ViewData["searchkey"]);

            ReportDocument rpt = new ReportDocument();

            try
            {
                int intId = Convert.ToInt32(Session["UserId"]);
                if (intId != 0)
                {
                    rpt.Load(Server.MapPath("~/ReportViewer/rptReceiptReport.rpt"));
                    rpt.SetParameterValue("@strId", strId);
                    rpt.SetParameterValue("@intLoginId", intId);
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
                    MemoryStream oStream = new MemoryStream();  // using System.IO           
                    //oStream = (MemoryStream)rpt.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                    CopyStream(rpt.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat), oStream);
                    Response.Clear();
                    Response.Buffer = true;
                    Response.ContentType = "application/pdf";
                    Response.BinaryWrite(oStream.ToArray());
                    Response.Flush();
                    Response.Close();
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

        public ActionResult ReportGrid_Read([DataSourceRequest]DataSourceRequest request)
        {
            return Json(ClsCommon.lstEchallan.ToDataSourceResult(request));
        }

        public JsonResult CheckPrintReceipt(string SearchKey)
        {
            ClsCommon.lstEchallan.Clear();
            try
            {
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    if (SearchKey != "")
                    {
                        var reportlist = ObjEnty.sp_GetReceiptDt(SearchKey).ToList();
                        if (reportlist.Count() != 0)
                        {
                            foreach (var f in reportlist)
                            {
                                ClsEChallan ObjCls = new ClsEChallan();
                                ObjCls.Id = f.Id;
                                ObjCls.strRecptNo = f.Receipt_Number;
                                ObjCls.DonorTypes = f.Donor_Types;
                                ObjCls.strAccNo = f.Account_Number;
                                ObjCls.strNameOfDonar = f.Name_Of_Donor;
                                ObjCls.strAddress = f.Address;
                                ObjCls.strCity = f.City;
                                ObjCls.strPincode = f.Pincode;
                                ObjCls.strMobNumber = f.Mobile_Number;
                                ObjCls.strEmail = f.Email_Id;
                                ObjCls.strPaymentMode = f.Payment_Mode;
                                ObjCls.decAmount = f.Amount;
                                ObjCls.strChequeNumber = f.DD_OR_Cheque_Number;
                                ObjCls.dtChequeDate = f.DD_OR_Cheque_Date;
                                ObjCls.strPANcardNumber = f.PANcard_Number;
                                ObjCls.srtRecptDate = Convert.ToDateTime(f.Receipt_Date).ToShortDateString();
                                ClsCommon.lstEchallan.Add(ObjCls);
                            }
                            strStatusMsg = "Success";
                        }

                    }
                    //else
                    //{
                    //    ClsCommon.lstEchallan.Clear();                        
                    //}
                    //ClsCommon.lstEchallan = ClsCommon.lstEchallan.Take(600).ToList();
                }
                return Json(strStatusMsg, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //----------Date wise--------------
        public JsonResult CheckPrintReceiptDatewise(string FromDate, string ToDate)
        {
            ClsCommon.lstEchallan.Clear();
            DateTime frmdate = Convert.ToDateTime(FromDate);
            DateTime todate = Convert.ToDateTime(ToDate);
            try
            {
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    var reportlist = ObjEnty.sp_GetReceiptDatewise(frmdate, todate).ToList();
                    if (reportlist.Count() != 0)
                    {
                        foreach (var f in reportlist)
                        {
                            ClsEChallan ObjCls = new ClsEChallan();
                            ObjCls.Id = f.Id;
                            ObjCls.strRecptNo = f.Receipt_Number;
                            ObjCls.DonorTypes = f.Donor_Types;
                            ObjCls.strAccNo = f.Account_Number;
                            ObjCls.strNameOfDonar = f.Name_Of_Donor;
                            ObjCls.strAddress = f.Address;
                            ObjCls.strCity = f.City;
                            ObjCls.strPincode = f.Pincode;
                            ObjCls.strMobNumber = f.Mobile_Number;
                            ObjCls.strEmail = f.Email_Id;
                            ObjCls.strPaymentMode = f.Payment_Mode;
                            ObjCls.decAmount = f.Amount;
                            ObjCls.strChequeNumber = f.DD_OR_Cheque_Number;
                            ObjCls.dtChequeDate = f.DD_OR_Cheque_Date;
                            ObjCls.strPANcardNumber = f.PANcard_Number;
                            ObjCls.srtRecptDate = Convert.ToDateTime(f.Receipt_Date).ToShortDateString();
                            ClsCommon.lstEchallan.Add(ObjCls);
                        }
                        strStatusMsg = "Success";
                    }
                    //else
                    //{
                    //    ClsCommon.lstEchallan.Clear();                        
                    //}
                    //ClsCommon.lstEchallan = ClsCommon.lstEchallan.Take(600).ToList();
                }
                return Json(strStatusMsg, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public JsonResult Checkreport(string strId)
        {
            int intUserId = Convert.ToInt32(Session["UserId"]);
            try
            {
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    var reportlist = ObjEnty.sp_GetReceiptDt_By_ID(strId, intUserId).ToList();
                    if (reportlist.Count() != 0)
                    {
                        foreach (var f in reportlist)
                        {
                            //----------- track for who getting print receipt ( Log history ) --------
                            ClsCommon.LogHistory(f.Id, "PrintReceipt", intUserId);
                        }
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

        public ActionResult PrintFund()
        {
            //return ReportManagement.PdfViewController.ViewPdf("Customer report", "PrintDemo", customerList);
            return View();
        }

        #endregion


        #region ------------ test Pdf Not Used -------------------

        //-------------------------------------------- test PDF Not Use --------------------------

        //public ActionResult TestPrintPDF()
        //{
        //    ClsEChallan model = new ClsEChallan();
        //    if (Session["UserId"] == null)
        //    {
        //        return RedirectToAction("Logintest", "Login");
        //    }
        //    ClsCommon.lstEchallan.Clear();

        //    int intCount = 0;
        //    int intHeadingCount = 0;
        //    decimal? totalAmount = 0;
        //    decimal? TempTotalAmount = 0;
        //    int intDonorTypeCount = 0;
        //    int intTempColumCount = 0;
        //    //decimal? ColoumtotalAmount = 0;
        //    List<ClsEChallan> lstTempHeader = new List<ClsEChallan>();
        //    List<ClsEChallan> lstTempBelowHeader = new List<ClsEChallan>();
        //    List<ClsEChallan> lstTempDateCount = new List<ClsEChallan>();

        //    using (SaiAramFoundationEntities dbcontext = new SaiAramFoundationEntities())
        //    {
        //        ClsEChallan clsH = new ClsEChallan();
        //        var s = (from f in dbcontext.T_EChallan
        //                 join c in dbcontext.T_DONOR_CATEGORIES on f.Donation_Types equals c.Id
        //                 where c.Is_Active == true
        //                 select new
        //                 {
        //                     c.Donor_Types
        //                 }).Distinct().ToList();

        //        foreach (var i in s)
        //        {
        //            ClsEChallan cls = new ClsEChallan();
        //            cls.DonorTypes = i.Donor_Types;
        //            intHeadingCount = intHeadingCount + 1;
        //            cls.chkHeaderCount = intHeadingCount;
        //            lstTempHeader.Add(cls);
        //        }
        //        clsH.DonorTypes = "Total";
        //        clsH.chkHeaderCount = intHeadingCount + 1;
        //        lstTempHeader.Add(clsH);


        //        var Date = dbcontext.sp_FundCollection_DateOnly().ToList();

        //        lstTempDateCount = (from T in Date
        //                            select new ClsEChallan
        //                            {
        //                                strRecptDate = string.Format("{0:dd/MM/yyyy}", T.Receipt_Date)
        //                            }).ToList();

        //        foreach (var k in Date)
        //        {
        //            ClsEChallan clsobj = new ClsEChallan();
        //            DateTime? ReceiptDate = k.Receipt_Date;


        //            var DonerType = (from f in dbcontext.T_EChallan
        //                             join c in dbcontext.T_DONOR_CATEGORIES on f.Donation_Types equals c.Id
        //                             where c.Is_Active == true
        //                             select new
        //                             {
        //                                 c.Donor_Types
        //                             }).Distinct().ToList();
        //            intCount = intCount + 1;

        //            totalAmount = 0;
        //            intDonorTypeCount = DonerType.Count();
        //            intTempColumCount = 0;
        //            foreach (var i in DonerType)
        //            {
        //                ClsEChallan cls = new ClsEChallan();
        //                cls.DonorTypes = i.Donor_Types;
        //                var D = dbcontext.sp_FundCollection_Below().ToList();
        //                foreach (var j in D)
        //                {
        //                    ClsEChallan obj = new ClsEChallan();
        //                    ClsEChallan objexist = new ClsEChallan();
        //                    if (cls.DonorTypes == j.Donor_Types && ReceiptDate == j.Receipt_Date)
        //                    {
        //                        intTempColumCount = intTempColumCount + 1;
        //                        obj.srtRecptDate = string.Format("{0:dd/MM/yyyy}", j.Receipt_Date);
        //                        obj.strRecptNo = j.Receipt_Number;
        //                        obj.decAmount = j.Amount;
        //                        totalAmount = j.Amount + totalAmount;
        //                        obj.RowTotal = totalAmount;
        //                        obj.chkCount = intCount;
        //                        obj.intColumCount = intTempColumCount;
        //                        obj.DonerTypeCount = intDonorTypeCount;
        //                        obj.DonorTypes = j.Donor_Types;
        //                        lstTempBelowHeader.Add(obj);
        //                        break;
        //                    }
        //                }

        //            }
        //        }
        //    }




        //    List<ClsEChallan> lstTempGrandTotal = (from a in lstTempBelowHeader
        //                                           group a by a.DonorTypes into grp
        //                                           select new ClsEChallan
        //                                           {
        //                                               DonorTypes = grp.FirstOrDefault().DonorTypes,
        //                                               ColoumTotal = grp.Sum(x => x.decAmount)
        //                                           }).ToList();
        //    decimal? TempGrandTotal = 0;
        //    int GrandTotalCount = 0;

        //    foreach (var item in lstTempGrandTotal)
        //    {
        //        TempGrandTotal = TempGrandTotal + item.ColoumTotal;
        //        GrandTotalCount = GrandTotalCount + 1;

        //    }

        //    lstTempGrandTotal.ForEach(x => { x.GrandTotal = TempGrandTotal; x.chkGrantTotalCount = GrandTotalCount; });

        //    model.lstHeader = lstTempHeader;
        //    model.lstBelowHeader = lstTempBelowHeader;
        //    model.lstGrandTotal = lstTempGrandTotal;
        //    model.lstDateCount = lstTempDateCount;

        //    //return new RazorPDF.PdfResult(model, "TestPrintPDF");
        //    return View(model);

        //}

        #endregion



        #region Fund Collection Monthwise


        public ActionResult FundCollectionMonthwise()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }
            // fncFundReport();
            return View();
        }




        #endregion


        #region Checking Report and Exporting to pdf


        public JsonResult Json_CheckMonthReport(string fromdate, string todate)
        {
            string strMsg = string.Empty;
            DateTime dtfromdate = Convert.ToDateTime(fromdate);
            DateTime dttodate = Convert.ToDateTime(todate);
            try
            {
                using (SaiAramFoundationEntities dbContext = new SaiAramFoundationEntities())
                {
                    var lstFundCollectionMonthwises = dbContext.FundCollectionMonthwiseWithParameters(dtfromdate, dttodate).ToList();
                    if (lstFundCollectionMonthwises.Count == 0)
                    {
                        strMsg = "No";
                    }
                    else
                    {
                        strMsg = "Yes";
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(strMsg, JsonRequestBehavior.AllowGet);
        }



        public ActionResult fncFundReport(int intyear, string fromdate, string todate)
        {


            MemoryStream mem = new MemoryStream();
            string strMonth = string.Empty;
            string strGeneratepdf = string.Empty;
            int intCount = 0;
            int intHeadingCount = 0;
            decimal? totalAmount = 0;
            decimal? TempTotalAmount = 0;
            int intDonorTypeCount = 0;
            int intTempColumCount = 0;
            //decimal? ColoumtotalAmount = 0;
            List<ClsEChallan> lstTempHeader = new List<ClsEChallan>();
            List<ClsEChallan> lstTempBelowHeader = new List<ClsEChallan>();
            List<ClsEChallan> lstTempDateCount = new List<ClsEChallan>();
            DateTime dtfromdate = Convert.ToDateTime(fromdate);
            DateTime dttodate = Convert.ToDateTime(todate);
            try
            {
                using (SaiAramFoundationEntities dbContext = new SaiAramFoundationEntities())
                {

                    ClsEChallan clsH = new ClsEChallan();
                    var s = (from f in dbContext.T_EChallan
                             join c in dbContext.T_DONOR_CATEGORIES on f.Donation_Types equals c.Id
                             where c.Is_Active == true
                             select new
                             {
                                 c.Donor_Types
                             }).Distinct().OrderBy(x => x.Donor_Types).ToList();


                    var lstFundCollectionMonthwises = dbContext.FundCollectionMonthwiseWithParameters(dtfromdate, dttodate).ToList();

                    var lstFundCollectionCash = lstFundCollectionMonthwises.Where(x => x.Payment_Mode.Trim().ToUpper() == "CASH")
                                                .OrderBy(c => c.Donor_Types)
                                                .ToList();
                    var lstFundCollectionDDorCheque = lstFundCollectionMonthwises
                                                      .Where(x => x.Payment_Mode.Trim().ToUpper() == "DD" || x.Payment_Mode.Trim().ToUpper() == "CHEQUE")
                                                      .GroupBy(x => x.Months).Select(b => new
                                                      {
                                                          Month = b.Select(x => x.Months).FirstOrDefault(),
                                                          MonthYear = b.Select(x => x.MonthYear).FirstOrDefault(),
                                                          Amount = b.Sum(x => x.Amount)
                                                      }).ToList();



                    mem = new MemoryStream();
                    var doc = new Document(PageSize.A4_LANDSCAPE, 0, 0, 100, 0);
                    BaseFont bfTimes = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, false);
                    Font fntWish = new Font(FontFactory.GetFont("Arial Narrow", 14, iTextSharp.text.Font.ITALIC, BaseColor.BLACK));
                    Font fntBig = new Font(FontFactory.GetFont("Arial Narrow", 18, iTextSharp.text.Font.ITALIC, BaseColor.RED));
                    Font fntHeading = FontFactory.GetFont("Arial Narrow", 14, Font.BOLD);
                    Font fntWhite = FontFactory.GetFont("Arial", 8, Font.NORMAL, BaseColor.WHITE);
                    Font fntNormal = FontFactory.GetFont("Arial", 12, Font.NORMAL, BaseColor.BLACK);
                    Font fntsmall = FontFactory.GetFont("Arial", 7, Element.ALIGN_LEFT, BaseColor.BLACK);
                    Font fntNormalTxt = FontFactory.GetFont("Arial", 10, Element.ALIGN_LEFT, BaseColor.BLACK);
                    Font fntBold = FontFactory.GetFont("Arial", 10, Font.BOLD);
                    Font fntBold1 = FontFactory.GetFont("Arial", 14, Font.BOLD);
                    Font fntBoldred = FontFactory.GetFont("Arial", 8, Font.BOLD, BaseColor.RED);
                    PdfWriter pWriter = PdfWriter.GetInstance(doc, mem);
                    Rectangle pageRect = doc.PageSize;
                    //  LengthFixingStream strmpdfdtream = new LengthFixingStream();
                    //  TwoColumnHeaderFooter PageEventHandler = new TwoColumnHeaderFooter();
                    //  pWriter.PageEvent = PageEventHandler;
                    doc.Open();


                    //Title

                    PdfPTable tblTitle = new PdfPTable(1);
                    //tblTitle.DefaultCell.Border = 0;
                    //tblTitle.DefaultCell.FixedHeight = 10f;
                    tblTitle.DefaultCell.VerticalAlignment = Element.ALIGN_CENTER;
                    tblTitle.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    //tblTitle.DefaultCell.BorderWidth = 0;
                    //tblTitle.DefaultCell.BorderColor = BaseColor.RED;
                    //tblTitle.DefaultCell.BorderColorTop = BaseColor.WHITE;
                    // tblTitle.DefaultCell.BorderColor = BaseColor.WHITE;
                    //tblTitle.SetWidths(new int[1] { 600 });

                    PdfPCell objTitle = new PdfPCell(new Phrase("ARAM FOUNDATION", fntBold1));
                    objTitle.HorizontalAlignment = Element.ALIGN_CENTER;
                    objTitle.VerticalAlignment = Element.ALIGN_BOTTOM;
                    objTitle.FixedHeight = 25f;
                    objTitle.BorderWidthBottom = 1;
                    objTitle.BorderColorBottom = BaseColor.WHITE;
                    tblTitle.AddCell(objTitle);
                    doc.Add(tblTitle);

                    PdfPTable tblTitleaddress = new PdfPTable(1);
                    //tblTitle.DefaultCell.Border = 0;
                    //tblTitle.DefaultCell.FixedHeight = 10f;
                    tblTitleaddress.DefaultCell.VerticalAlignment = Element.ALIGN_CENTER;
                    tblTitleaddress.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    // tblTitleaddress.SetWidths(new int[1] { 600 });

                    PdfPCell objTitle1 = new PdfPCell(new Phrase("No.41, Madley Road, T.Nagar, Chennai - 600 017.", fntsmall));
                    objTitle1.HorizontalAlignment = Element.ALIGN_CENTER;
                    objTitle1.VerticalAlignment = Element.ALIGN_CENTER;
                    objTitle1.FixedHeight = 25f;
                    objTitle1.BorderWidthTop = 1;
                    objTitle1.BorderColorTop = BaseColor.WHITE;
                    tblTitleaddress.AddCell(objTitle1);
                    doc.Add(tblTitleaddress);

                    // Heading contains Donor types dynamically with Total and DD and final total

                    int headingcount = s.Count + 4;

                    PdfPTable tblHeading = new PdfPTable(headingcount);
                    tblHeading.DefaultCell.Border = 1;
                    //tblHeading.DefaultCell.FixedHeight = 20;
                    tblHeading.DefaultCell.VerticalAlignment = Element.ALIGN_CENTER;
                    tblHeading.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    tblHeading.DefaultCell.BorderWidth = 1;
                    tblHeading.DefaultCell.FixedHeight = 20;
                    //tblHeading.DefaultCell.BorderColor = BaseColor.WHITE;

                    PdfPCell objheading1 = new PdfPCell(new Phrase("Month-Year", fntBold));
                    objheading1.HorizontalAlignment = Element.ALIGN_CENTER;
                    objheading1.VerticalAlignment = Element.ALIGN_CENTER;
                    objheading1.FixedHeight = 25f;

                    // objheading1.Border = 0;
                    // objheading1.BorderWidth = 0;
                    tblHeading.AddCell(objheading1);

                    foreach (var i in s)
                    {
                        PdfPCell objheadingDonors = new PdfPCell(new Phrase(i.Donor_Types, fntBold));
                        objheadingDonors.HorizontalAlignment = Element.ALIGN_CENTER;
                        objheadingDonors.VerticalAlignment = Element.ALIGN_CENTER;
                        objheading1.FixedHeight = 25f;
                        //objheadingDonors.Border = 1;
                        //objheadingDonors.BorderWidth = 0;
                        tblHeading.AddCell(objheadingDonors);
                    }

                    PdfPCell objheadingtot = new PdfPCell(new Phrase("Total", fntBold));
                    objheadingtot.HorizontalAlignment = Element.ALIGN_CENTER;
                    objheadingtot.VerticalAlignment = Element.ALIGN_CENTER;
                    objheading1.FixedHeight = 25f;
                    //objheadingtot.Border = 1;
                    //objheadingtot.BorderWidth = 0;
                    tblHeading.AddCell(objheadingtot);

                    PdfPCell objheadingDDorCheque = new PdfPCell(new Phrase("DD or Cheque", fntBold));
                    objheadingDDorCheque.HorizontalAlignment = Element.ALIGN_CENTER;
                    objheadingDDorCheque.VerticalAlignment = Element.ALIGN_CENTER;
                    objheading1.FixedHeight = 25f;
                    //objheadingDDorCheque.Border = 1;
                    //objheadingDDorCheque.BorderWidth = 0;
                    tblHeading.AddCell(objheadingDDorCheque);

                    PdfPCell objheadingtotal = new PdfPCell(new Phrase("Total", fntBold));
                    objheadingtotal.HorizontalAlignment = Element.ALIGN_CENTER;
                    objheadingtotal.VerticalAlignment = Element.ALIGN_CENTER;
                    objheading1.FixedHeight = 25f;
                    //objheadingtotal.Border = 1;
                    //objheadingtotal.BorderWidth = 0;
                    tblHeading.AddCell(objheadingtotal);

                    doc.Add(tblHeading);

                    // Inner table,dynamically binding according to donor types

                    // Binding all months

                    string[] strMontharray = { "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR" };
                    // string[] strMontharrayheading = { "APR-" + stryear, "MAY-" + stryear, "JUN-" + stryear, "JUL-" + stryear, "AUG-" + stryear, "SEP-" + stryear, "OCT-" + stryear, "NOV-" + stryear, "DEC-" + stryear, "JAN-" + stryear, "FEB-" + stryear, "MAR-" + stryear };

                    PdfPTable tblMonths = new PdfPTable(headingcount);
                    tblMonths.DefaultCell.Border = 1;
                    //tblMonths.DefaultCell.FixedHeight = 55f;
                    tblMonths.DefaultCell.VerticalAlignment = Element.ALIGN_CENTER;
                    tblMonths.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    tblMonths.DefaultCell.BorderWidth = 1;
                    // tblMonths.DefaultCell.BorderColor = BaseColor.WHITE;
                    int intmonthcnt = 0;
                    foreach (string months in strMontharray)
                    {
                        PdfPCell objMonthsheading = new PdfPCell();
                        intmonthcnt++;
                        if (intmonthcnt >= 10)
                        {
                            int endyear = intyear + 1;
                            objMonthsheading = new PdfPCell(new Phrase(months + "-" + endyear, fntBold));
                        }
                        else
                        {
                            objMonthsheading = new PdfPCell(new Phrase(months + "-" + intyear, fntBold));
                        }

                        objMonthsheading.HorizontalAlignment = Element.ALIGN_CENTER;
                        objMonthsheading.VerticalAlignment = Element.ALIGN_CENTER;
                        objMonthsheading.FixedHeight = 25f;
                        // objMonthsheading.Border = 1;
                        // objMonthsheading.BorderWidth = 0;
                        tblMonths.AddCell(objMonthsheading);

                        foreach (var donortypes in s)
                        {
                            var donor = lstFundCollectionCash.Where(x => x.Months.Trim().ToUpper() == months
                                        && x.Donor_Types.Trim() == donortypes.Donor_Types.Trim()).FirstOrDefault();

                            if (donor != null)
                            {
                                PdfPCell objMonths = new PdfPCell(new Phrase(Convert.ToString(donor.Amount), fntNormalTxt));
                                objMonths.HorizontalAlignment = Element.ALIGN_RIGHT;
                                objMonths.VerticalAlignment = Element.ALIGN_RIGHT;
                                //  objMonths.Border = 1;
                                // objMonths.BorderWidth = 0;
                                tblMonths.AddCell(objMonths);
                            }

                            else
                            {
                                PdfPCell objMonths = new PdfPCell(new Phrase("0", fntNormalTxt));
                                objMonths.HorizontalAlignment = Element.ALIGN_RIGHT;
                                objMonths.VerticalAlignment = Element.ALIGN_RIGHT;
                                // objMonths.Border = 1;
                                //  objMonths.BorderWidth = 0;
                                tblMonths.AddCell(objMonths);
                            }
                        }


                        decimal? dcCashTotal = lstFundCollectionCash.Where(x => x.Months.Trim().ToUpper() == months).Select(x => x.Amount).Sum();
                        //dcCashTotal = dcCashTotal ?? 0;

                        PdfPCell objcashtotal = new PdfPCell(new Phrase(Convert.ToString(dcCashTotal), fntBold));
                        objcashtotal.HorizontalAlignment = Element.ALIGN_RIGHT;
                        objcashtotal.VerticalAlignment = Element.ALIGN_RIGHT;
                        //  objcashtotal.Border = 0;
                        // objcashtotal.BorderWidth = 0;
                        tblMonths.AddCell(objcashtotal);

                        decimal? dcDDorCheque = lstFundCollectionDDorCheque.Where(x => x.Month.Trim().ToUpper() == months).Select(x => x.Amount).FirstOrDefault();
                        if (dcDDorCheque == null)
                        {
                            dcDDorCheque = Convert.ToDecimal("0");
                        }

                        PdfPCell objDDorCheque = new PdfPCell(new Phrase(Convert.ToString(dcDDorCheque), fntNormalTxt));
                        objDDorCheque.HorizontalAlignment = Element.ALIGN_RIGHT;
                        objDDorCheque.VerticalAlignment = Element.ALIGN_RIGHT;
                        //objDDorCheque.Border = 1;
                        //objDDorCheque.BorderWidth = 0;
                        tblMonths.AddCell(objDDorCheque);

                        decimal? dctotal = dcCashTotal + dcDDorCheque;

                        PdfPCell objtotal = new PdfPCell(new Phrase(Convert.ToString(dctotal), fntBold));
                        objtotal.HorizontalAlignment = Element.ALIGN_RIGHT;
                        objtotal.VerticalAlignment = Element.ALIGN_RIGHT;
                        //objtotal.Border = 1;
                        //objtotal.BorderWidth = 0;
                        tblMonths.AddCell(objtotal);


                    }

                    doc.Add(tblMonths);

                    PdfPTable tblFinalTotal = new PdfPTable(headingcount);
                    tblFinalTotal.DefaultCell.Border = 1;
                    tblFinalTotal.DefaultCell.FixedHeight = 0;
                    tblFinalTotal.DefaultCell.VerticalAlignment = Element.ALIGN_RIGHT;
                    tblFinalTotal.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                    tblFinalTotal.DefaultCell.BorderWidth = 1;
                    //tblFinalTotal.DefaultCell.BorderColor = BaseColor.WHITE;

                    PdfPCell objtotalempty = new PdfPCell(new Phrase("", fntBold));
                    objtotalempty.HorizontalAlignment = Element.ALIGN_RIGHT;
                    objtotalempty.VerticalAlignment = Element.ALIGN_RIGHT;
                    objtotalempty.FixedHeight = 25f;
                    // objtotalempty.Border = 1;
                    // objtotalempty.BorderWidth = 0;
                    tblFinalTotal.AddCell(objtotalempty);


                    foreach (var donortypes in s)
                    {
                        decimal? dcDonorFinalTotal = lstFundCollectionCash.Where(x => x.Donor_Types.Trim() == donortypes.Donor_Types.Trim()).Select(x => x.Amount).Sum();


                        PdfPCell objtotaldonorfinal = new PdfPCell(new Phrase(Convert.ToString(dcDonorFinalTotal), fntBold));
                        objtotaldonorfinal.HorizontalAlignment = Element.ALIGN_RIGHT;
                        objtotaldonorfinal.VerticalAlignment = Element.ALIGN_RIGHT;
                        objtotalempty.FixedHeight = 25f;
                        // objtotalempty.Border = 1;
                        // objtotalempty.BorderWidth = 0;
                        tblFinalTotal.AddCell(objtotaldonorfinal);


                    }

                    decimal? dcCashFinalTotal = lstFundCollectionCash.Select(x => x.Amount).Sum();

                    PdfPCell objfinalcashtotal = new PdfPCell(new Phrase(Convert.ToString(dcCashFinalTotal), fntBold));
                    objfinalcashtotal.HorizontalAlignment = Element.ALIGN_RIGHT;
                    objfinalcashtotal.VerticalAlignment = Element.ALIGN_RIGHT;
                    objtotalempty.FixedHeight = 25f;
                    // objfinalcashtotal.Border = 1;
                    // objfinalcashtotal.BorderWidth = 0;
                    tblFinalTotal.AddCell(objfinalcashtotal);

                    decimal? dcDDorChequeFinalTotal = lstFundCollectionDDorCheque.Select(x => x.Amount).Sum();

                    PdfPCell objtotalempty1 = new PdfPCell(new Phrase(Convert.ToString(dcDDorChequeFinalTotal), fntBold));
                    objtotalempty1.HorizontalAlignment = Element.ALIGN_RIGHT;
                    objtotalempty1.VerticalAlignment = Element.ALIGN_RIGHT;
                    objtotalempty.FixedHeight = 25f;
                    // objtotalempty1.Border = 1;
                    // objtotalempty1.BorderWidth = 0;
                    tblFinalTotal.AddCell(objtotalempty1);

                    decimal? dcFinaltotal = lstFundCollectionMonthwises.Select(x => x.Amount).Sum();

                    PdfPCell objfinaltotal = new PdfPCell(new Phrase(Convert.ToString(dcFinaltotal), fntBold));
                    objfinaltotal.HorizontalAlignment = Element.ALIGN_RIGHT;
                    objfinaltotal.VerticalAlignment = Element.ALIGN_RIGHT;
                    objtotalempty.FixedHeight = 25f;
                    //  objfinaltotal.Border = 1;
                    //  objfinaltotal.BorderWidth = 0;
                    tblFinalTotal.AddCell(objfinaltotal);

                    doc.Add(tblFinalTotal);

                    //-------------- Whole Table -----------------------
                    PdfPTable tablebig = new PdfPTable(1);
                    //tablebig.TotalWidth = 520f;

                    tablebig.DefaultCell.VerticalAlignment = Element.ALIGN_CENTER;
                    tablebig.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    tablebig.DefaultCell.Border = 0;
                    tablebig.DefaultCell.FixedHeight = 60f;
                    //tablebig.DefaultCell.BorderColor = BaseColor.RED;
                    //tablebig.DefaultCell.Border = 1;
                    //  tablebig.DefaultCell.BorderWidth = 1;
                    // tablebig.DefaultCell.BorderColor = BaseColor.WHITE;
                    //tablebig.LockedWidth = true;

                    PdfPCell celltitle = new PdfPCell(tblTitle);
                    celltitle.HorizontalAlignment = Element.ALIGN_CENTER;
                    celltitle.VerticalAlignment = Element.ALIGN_CENTER;
                    celltitle.Border = 0;
                    tablebig.AddCell(celltitle);

                    PdfPCell cellheading = new PdfPCell(tblHeading);
                    cellheading.HorizontalAlignment = Element.ALIGN_CENTER;
                    cellheading.VerticalAlignment = Element.ALIGN_CENTER;
                    tablebig.AddCell(cellheading);

                    PdfPCell cellmonths = new PdfPCell(tblMonths);
                    cellmonths.HorizontalAlignment = Element.ALIGN_CENTER;
                    cellmonths.VerticalAlignment = Element.ALIGN_CENTER;
                    tablebig.AddCell(cellmonths);

                    PdfPCell cellfinaltotal = new PdfPCell(tblFinalTotal);
                    cellfinaltotal.HorizontalAlignment = Element.ALIGN_CENTER;
                    cellfinaltotal.VerticalAlignment = Element.ALIGN_CENTER;
                    tablebig.AddCell(cellfinaltotal);

                    //doc.Add(tablebig);
                    pWriter.CloseStream = false;
                    doc.Close();
                    byte[] bytes = new byte[mem.Length];
                    bytes = mem.ToArray();
                    return File(mem.ToArray(), "application/pdf", "Fund Collection Report" + ".pdf");
                }
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
    }
}
