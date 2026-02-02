using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using E_Challan.Models;
using Kendo.Mvc.UI;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.Mvc.Extensions;
using System.Data;

namespace E_Challan.Controllers
{
    public class EChallanController : Controller
    {
        public string strMessage = string.Empty;

        public ActionResult EChallan()
        {
            try
            {
                if (Session["UserId"] == null)
                {
                    return RedirectToAction("Logintest", "Login");
                }

                using (SaiAramFoundationEntities objEnty = new SaiAramFoundationEntities())
                {
                    ClsEChallan obj = new ClsEChallan();
                    int intUserId = Convert.ToInt32(Session["UserId"]);
                    //string strLocation = (from a in objEnty.T_USER where a.Id == intUserId select a.Location).FirstOrDefault();
                    //if (strLocation != null && strLocation != "")
                    //{                        
                    //    obj.strRecptNo = ReceiptNumber(strLocation);
                    //}                                                      
                    GetUserList();
                    GetCountryList();
                    GetIndiaState();
                    return View(obj);
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        [HttpPost]
        public ActionResult EChallan(ClsEChallan obj)
        {
          //  MemoryStream objMemstrem = new MemoryStream();
            try
            {
                if (Session["UserId"] == null)
                {
                    return RedirectToAction("Logintest", "Login");
                }
                int intUserId = Convert.ToInt32(Session["UserId"]);
                string strUserType = Convert.ToString(Session["UserType"]);
                using (SaiAramFoundationEntities objEnty = new SaiAramFoundationEntities())
                {

                    T_EChallan tblObj = new T_EChallan();

                    tblObj.Donation_Types = obj.intDonartype;
                    tblObj.Receipt_Number = ReceiptNumber(obj.intDonartype);
                    tblObj.Account_Number = AccountNumber(obj.intDonartype);
                    tblObj.Name_Of_Donor = obj.strNameOfDonar;
                    tblObj.Address = obj.strAddress;

                    var Country = objEnty.T_Country.Where(s => s.Id == obj.intCountry).FirstOrDefault();
                    tblObj.Country_Id = obj.intCountry;
                    tblObj.Country_Name = Country.Country_Name;

                    //if (strUserType == "Admin")
                    //{
                    //    tblObj.Location = obj.strLocation;
                    //}
                    //else
                    //{
                    //    tblObj.Location = (from a in objEnty.T_USER where a.Id == intUserId select a.Location).FirstOrDefault();
                    //}

                    if (obj.intState != 0)
                    {
                        var State = objEnty.T_State.Where(s => s.Id == obj.intState).FirstOrDefault();
                        tblObj.State_Id = obj.intState;
                        tblObj.State_Name = State.State_Name;
                    }
                    else
                    {
                        tblObj.State_Name = obj.strState;
                    }
                    tblObj.City = obj.strCity;
                    tblObj.Pincode = obj.strPincode;
                    tblObj.Telephone_Number = obj.strTeleNumber;
                    tblObj.Mobile_Number = obj.strMobNumber;
                    tblObj.Email_Id = obj.strEmail;
                    tblObj.Payment_Mode = obj.strPaymentMode;
                    tblObj.Amount = obj.decAmount;
                    tblObj.PANcard_Number = obj.strPANcardNumber;
                    tblObj.Receipt_Date = Convert.ToDateTime(obj.strRecptDate);
                    tblObj.Created_Date = DateTime.Today;
                    tblObj.Created_by = intUserId;
                    tblObj.Amount_In_Words = obj.strAmountInWords;
                    tblObj.Type = "Offline";
                    tblObj.Is_Active = true;
                    //tblObj.Created_by = Convert.ToInt32(Session["UserId"]);
                    if (obj.strPaymentMode == "DD")
                    {
                        tblObj.DD_OR_Cheque_Number = obj.strDDNumber;
                        tblObj.DD_OR_Cheque_Date = Convert.ToDateTime(obj.strDDDate);
                        tblObj.DD_OR_Cheque_BankName = obj.strDDBank;
                        tblObj.DD_OR_Cheque_Branch = obj.strDDBranch;
                    }

                    else if (obj.strPaymentMode == "Cheque")
                    {
                        tblObj.DD_OR_Cheque_Number = obj.strChequeNumber;
                        tblObj.DD_OR_Cheque_Date = Convert.ToDateTime(obj.strChequeDate);
                        tblObj.DD_OR_Cheque_BankName = obj.strChequeBank;
                        tblObj.DD_OR_Cheque_Branch = obj.strChequeBranch;
                    }

                    objEnty.T_EChallan.Add(tblObj);
                    objEnty.SaveChanges();
                    ClsCommon.LogHistory(tblObj.Id, "ChallanEntry", intUserId);
                    Session["PDFPrintId"] = tblObj.Id;


                }
                return RedirectToAction("PrintPdf");

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public ActionResult PrintPdf()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }
            return View();
        }

        [HttpPost]
        public ActionResult PrintPdf(ClsEChallan obj)
        {

            MemoryStream objMemstrem = new MemoryStream();
            try
            {
                if (obj.strButtonValue == "Make Another Donation")
                {
                    return RedirectToAction("EChallan");
                }

                else
                {
                    using (SaiAramFoundationEntities objEnty = new SaiAramFoundationEntities())
                    {
                        string strPrintId = Convert.ToString(Session["PDFPrintId"]);
                        //var print = (from a in objEnty.T_EChallan where a.Id == intPrintId select a).FirstOrDefault();
                        //if (print != null)
                        //{
                        //    obj.strNameOfDonar = print.Name_Of_Donor;
                        //    obj.strAddress = print.Address;
                        //    obj.strTeleNumber = print.Telephone_Number;
                        //    obj.strPANcardNumber = print.PANcard_Number;
                        //    obj.strEmail = print.Email_Id;
                        //    obj.decAmount = print.Amount;

                        //    string strDonarType = (from a in objEnty.T_DONOR_CATEGORIES where a.Id == print.Donation_Types select a.Donor_Types).FirstOrDefault();
                        //    if (strDonarType != "")
                        //    {
                        //        obj.DonorTypes = strDonarType;
                        //    }

                        //}

                        //PrintReceiptController.Report(
                        //objMemstrem = PDF(obj);
                        Report();
                        return View();
                        //return File(objMemstrem.ToArray(), "application/pdf", "E-Challan.pdf");
                    }
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        
        public string ReceiptNumber(int intDonartype)
        {
            try
            {
                string ReceiptNo=string.Empty;
                string strCode=string.Empty;
                using (SaiAramFoundationEntities objEnty = new SaiAramFoundationEntities())
                {
                    var chkdata = (from z in objEnty.T_EChallan where z.Donation_Types == intDonartype && (z.Type.Trim().ToUpper() == "EXCEL" || z.Type.Trim().ToUpper() == "OFFLINE")  select z).FirstOrDefault();
                  
                    if (chkdata != null)
                    {

                        string rptNO = (from q in objEnty.T_EChallan where q.Donation_Types == intDonartype && (q.Type.Trim().ToUpper() == "EXCEL" || q.Type.Trim().ToUpper() == "OFFLINE") select q.Receipt_Number).DefaultIfEmpty().Max();

                        strCode = (from w in objEnty.T_DONOR_CATEGORIES where w.Id == intDonartype  select w.Donation_Code).FirstOrDefault();


                            if (rptNO != null)
                            {
                                string splid = rptNO.Substring(4).ToString();
                                int cid = Convert.ToInt32(splid) + 1;
                                string newString = Convert.ToString(cid).PadLeft(7, '0');
                                ReceiptNo = "AF" + strCode.Trim() + newString;
                            }
                    }

                    else
                    {
                        strCode = (from w in objEnty.T_DONOR_CATEGORIES where w.Id == intDonartype select w.Donation_Code).FirstOrDefault();
                        ReceiptNo = "AF" + strCode.Trim() + "1100001";

                    }
                }
                return ReceiptNo;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public string AccountNumber(int DonorType)
        {
            string AccountNo = string.Empty;
            try
            {
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    AccountNo = (from a in ObjEnty.T_DONOR_CATEGORIES where a.Id == DonorType select a.Account_Number).FirstOrDefault();
                }
                return AccountNo;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        //public JsonResult GetReceiptNo(string Location)
        //{
        //    try
        //    {
        //        string ReceiptNo = ReceiptNumber(Location);
        //        return Json(ReceiptNo, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }

        //}
        #region ------  Bind Dropdowns ----------

        public List<ClsEChallan> GetUserList()
        {
            List<ClsEChallan> lstDonar = new List<ClsEChallan>();
            using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
            {
                lstDonar = (from f in ObjEnty.T_DONOR_CATEGORIES
                            where f.Is_Active == true && f.Is_Deleted == false
                            select new ClsEChallan
                                                {
                                                    intDonartype = f.Id,
                                                    DonorTypes = f.Donor_Types,

                                                }).OrderBy(o => o.DonorTypes).ToList();
            }
            ViewBag.donor = new SelectList(lstDonar, "intDonartype", "DonorTypes");
            return lstDonar;

        }



        public List<ClsEChallan> GetCountryList()
        {
            List<ClsEChallan> lstDonar = new List<ClsEChallan>();
            using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
            {
                lstDonar = (from f in ObjEnty.T_Country
                            select new ClsEChallan
                            {
                                intCountry = f.Id,
                                strCountry = f.Country_Name,

                            }).OrderBy(o => o.strCountry).ToList();
            }
            ViewBag.Country = new SelectList(lstDonar, "intCountry", "strCountry");
            return lstDonar;

        }


        public JsonResult GetState(int CountryId)
        {
            SaiAramFoundationEntities Enty = new SaiAramFoundationEntities();

            var State = (from e in Enty.T_State
                         where e.Country_Id == CountryId
                         select new ClsEChallan
                         {
                             intState = e.Id,
                             strState = e.State_Name
                         }).OrderBy(o => o.strState).ToList();
            return Json(State, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetIndiaState()
        {
            SaiAramFoundationEntities Enty = new SaiAramFoundationEntities();

            var State = (from e in Enty.T_State
                         where e.Country_Id == 1
                         select new ClsEChallan
                         {
                             intState = e.Id,
                             strState = e.State_Name
                         }).OrderBy(o => o.strState).ToList();
            ViewBag.State = new SelectList(State, "intState", "strState");
            return Json(State, JsonRequestBehavior.AllowGet);
        }


        #endregion

        #region -----------  PDF Generate  -------------------

        public void Report()
        {
            string strId = Convert.ToString(Session["PDFPrintId"]);
            TableLogOnInfos crtableLogoninfos = new TableLogOnInfos();
            TableLogOnInfo crtableLogoninfo = new TableLogOnInfo();
            ConnectionInfo crConnectionInfo = new ConnectionInfo();

            Tables CrTables;
            //CrystalDecisions.CrystalReports.Engine.Table CrTable;

            //string strsearchKey = Convert.ToString(ViewData["searchkey"]);

            ReportDocument rpt = new ReportDocument();

            try
            {

                rpt.Load(Server.MapPath("~/ReportViewer/rptReceiptReport.rpt"));
                rpt.SetParameterValue("@strId", strId);
                rpt.SetParameterValue("@intLoginId", Convert.ToInt32(Session["UserId"]));
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
                //crvSaathii.ReportSource = rpt;
                MemoryStream oStream; // using System.IO           
                oStream = (MemoryStream)rpt.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                Response.Clear();
                Response.Buffer = true;
                Response.ContentType = "application/pdf";
                Response.BinaryWrite(oStream.ToArray());
                Response.End();
                Response.Flush();
                rpt.Dispose();
                rpt.Close();
                rpt = null;
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }


        #endregion



        [HttpPost]
        public JsonResult JsonPrintPdf()
        {

            string strMessage = "";
            try
            {
                using (SaiAramFoundationEntities objEnty = new SaiAramFoundationEntities())
                {
                    strMessage = "Success";
                    return Json(strMessage, JsonRequestBehavior.AllowGet);


                }
            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        #region--------------------------------Edit Echallan------------------------------


        public ActionResult EditEChallan()
        {
            try
            {
                if (Session["UserId"] == null)
                {
                    return RedirectToAction("Logintest", "Login");
                }

                using (SaiAramFoundationEntities objEnty = new SaiAramFoundationEntities())
                {
                    ClsEChallan obj = new ClsEChallan();
                    int intUserId = Convert.ToInt32(Session["UserId"]);
                    //string strLocation = (from a in objEnty.T_USER where a.Id == intUserId select a.Location).FirstOrDefault();
                    //if (strLocation != null && strLocation != "")
                    //{                        
                    //    obj.strRecptNo = ReceiptNumber(strLocation);
                    //}                                                      
                    GetUserList();
                    GetCountryList();
                    GetIndiaState();
                    ClsCommon.lstEchallan.Clear();
                    return View(obj);
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        #endregion


        #region-------------------------Grid Read---------------------------------------------------------------

        //public ActionResult EchallanGrid_Read([DataSourceRequest]DataSourceRequest request)
        //{
        //    // GetReportList();
        //    try
        //    {

        //        // ClsCommon.lstEchallanReport.Clear();
        //        List<ClsEChallanReport> lstTempEchallanReport = new List<ClsEChallanReport>();
        //      //  DateTime frmdate = DateTime.Today;
        //      //  DateTime todate = DateTime.Today;
        //        if (ClsCommon.lstEchallanReport.Count == 0)
        //        {
        //            using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
        //            {

        //                var echallanlist = (from p in ObjEnty.T_EChallan
        //                                    join c in ObjEnty.T_DONOR_CATEGORIES on p.Donation_Types equals c.Id

                                           
        //                                    select new
        //                                    {
        //                                        p.Id,
        //                                        p.Receipt_Number,
        //                                        c.Donor_Types,
        //                                        p.Account_Number,
        //                                        p.Name_Of_Donor,
        //                                        p.Address,
        //                                        p.City,
        //                                        p.Pincode,
        //                                        p.Telephone_Number,
        //                                        p.Mobile_Number,
        //                                        p.Email_Id,
        //                                        p.Payment_Mode,
        //                                        p.PANcard_Number,
        //                                        p.Amount,
        //                                        p.DD_OR_Cheque_Number,
        //                                        p.DD_OR_Cheque_Date,
        //                                        p.Receipt_Date,
        //                                        p.Created_Date


        //                                    }).ToList().OrderByDescending(p => p.Receipt_Date);

        //                foreach (var i in echallanlist)
        //                {
        //                    ClsEChallanReport objs = new ClsEChallanReport();
        //                    objs.Id=i.Id;
        //                    objs.Receipt_No = i.Receipt_Number;
        //                    objs.DonorTypes = i.Donor_Types;
        //                    objs.Account_No = i.Account_Number;
        //                    objs.Name_Of_Donor = i.Name_Of_Donor;
        //                    objs.Address = i.Address;
        //                    objs.City = i.City;
        //                    objs.Pincode = i.Pincode;
        //                    objs.Telephone = i.Telephone_Number;
        //                    objs.Mobile = i.Mobile_Number;
        //                    objs.Email = i.Email_Id;
        //                    objs.PaymentMode = i.Payment_Mode;
        //                    objs.PANcardNumber = i.PANcard_Number;
        //                    objs.Amount = i.Amount;
        //                    objs.DDChequeNumber = i.DD_OR_Cheque_Number;
        //                    objs.DDChequeDate = string.Format("{0:dd/MM/yyyy}", i.DD_OR_Cheque_Date);
        //                    objs.Receipt_Date = string.Format("{0:dd/MM/yyyy}", i.Receipt_Date);
        //                    objs.CreatedDate = string.Format("{0:dd/MM/yyyy}", i.Created_Date);
        //                    lstTempEchallanReport.Add(objs);
        //                }
        //                return Json(lstTempEchallanReport.ToDataSourceResult(request));
        //            }
        //        }
        //        else
        //        {
        //            return Json(ClsCommon.lstEchallanReport.ToDataSourceResult(request));
        //        }

        //    }

        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}


        public ActionResult Grid_ReadEchallan([DataSourceRequest]DataSourceRequest DS, string SearchKey)
        {

            try
            {
                List<ClsEChallan> lstGridEchallan = new List<ClsEChallan>();
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    if (!string.IsNullOrEmpty(SearchKey))
                    {
                        lstGridEchallan = ObjEnty.sp_GetReceiptDt(SearchKey).ToList().Select(f => new ClsEChallan
                        {
                            Id = f.Id,
                            strRecptNo = f.Receipt_Number,
                            dtRecptDate = f.Receipt_Date,
                            DonorTypes = f.Donor_Types,
                            strAccNo = f.Account_Number,
                            strNameOfDonar = f.Name_Of_Donor,
                            strAddress = f.Address,
                            strCity = f.City,
                            strPincode = f.Pincode,
                            strMobNumber = f.Mobile_Number,
                            strEmail = f.Email_Id,
                            strPaymentMode = f.Payment_Mode,
                            decAmount = f.Amount,
                            strChequeNumber = f.DD_OR_Cheque_Number,
                            dtChequeDate = f.DD_OR_Cheque_Date,
                            strPANcardNumber = f.PANcard_Number
                            //srtRecptDate = string.Format("{0:dd/MM/yyyy}", f.Receipt_Date)
                        }).ToList();
                        lstGridEchallan.ForEach(b =>
                        {
                            b.strRecptDate = string.Format("{0:dd/MM/yyyy}", b.dtRecptDate);
                            // b.srtRecptDate = string.Format("{0:dd/MM/yyyy}", b.dtRecptDate);
                            b.strChequeDate = string.Format("{0:dd/MM/yyyy}", b.dtChequeDate);

                        });

                        //if (reportlist.Count() != 0)
                        //{
                        //    foreach (var f in reportlist)
                        //    {
                        //        ClsEChallan ObjCls = new ClsEChallan();
                        //        ObjCls.Id = f.Id;
                        //        ObjCls.strRecptNo = f.Receipt_Number;
                        //        ObjCls.strRecptDate = string.Format("{0:dd/MM/yyyy}", f.Receipt_Date);
                        //        ObjCls.DonorTypes = f.Donor_Types;
                        //        ObjCls.strAccNo = f.Account_Number;
                        //        ObjCls.strNameOfDonar = f.Name_Of_Donor;
                        //        ObjCls.strAddress = f.Address;
                        //        ObjCls.strCity = f.City;
                        //        ObjCls.strPincode = f.Pincode;
                        //        ObjCls.strMobNumber = f.Mobile_Number;
                        //        ObjCls.strEmail = f.Email_Id;
                        //        ObjCls.strPaymentMode = f.Payment_Mode;
                        //        ObjCls.decAmount = f.Amount;
                        //        ObjCls.intChequeNumber = f.DD_OR_Cheque_Number;
                        //        ObjCls.strChequeDate = string.Format("{0:dd/MM/yyyy}", f.DD_OR_Cheque_Date);
                        //        ObjCls.strPANcardNumber = f.PANcard_Number;
                        //        ObjCls.srtRecptDate = string.Format("{0:dd/MM/yyyy}", f.Receipt_Date);
                        //        lstGridEchallan.Add(ObjCls);
                        //    }
                        //}
                    }
                    else
                    {
                        lstGridEchallan = (from f in ObjEnty.T_EChallan
                                           join d in ObjEnty.T_DONOR_CATEGORIES on f.Donation_Types equals d.Id
                                           select new ClsEChallan
                                           {
                                               Id = f.Id,
                                               strRecptNo = f.Receipt_Number,
                                               dtRecptDate = f.Receipt_Date,
                                               DonorTypes = d.Donor_Types,
                                               strAccNo = f.Account_Number,
                                               strNameOfDonar = f.Name_Of_Donor,
                                               strAddress = f.Address,
                                               strCity = f.City,
                                               strPincode = f.Pincode,
                                               strMobNumber = f.Mobile_Number,
                                               strEmail = f.Email_Id,
                                               strPaymentMode = f.Payment_Mode,
                                               decAmount = f.Amount,
                                               strChequeNumber = f.DD_OR_Cheque_Number,
                                               dtChequeDate = f.DD_OR_Cheque_Date,
                                               strPANcardNumber = f.PANcard_Number
                                           }).ToList();

                        lstGridEchallan.ForEach(b =>
                        {
                            b.strRecptDate = string.Format("{0:dd/MM/yyyy}", b.dtRecptDate);
                            // b.srtRecptDate = string.Format("{0:dd/MM/yyyy}", b.dtRecptDate);
                            b.strChequeDate = string.Format("{0:dd/MM/yyyy}", b.dtChequeDate);

                        });

                        //if (reportlistall.Count() != 0)
                        //{
                        //    foreach (var f in reportlistall)
                        //    {
                        //        ClsEChallan ObjCls = new ClsEChallan();
                        //        ObjCls.Id = f.Id;
                        //        ObjCls.strRecptNo = f.Receipt_Number;
                        //        ObjCls.strRecptDate = string.Format("{0:dd/MM/yyyy}", f.Receipt_Date);
                        //        ObjCls.DonorTypes = f.Donor_Types;
                        //        ObjCls.strAccNo = f.Account_Number;
                        //        ObjCls.strNameOfDonar = f.Name_Of_Donor;
                        //        ObjCls.strAddress = f.Address;
                        //        ObjCls.strCity = f.City;
                        //        ObjCls.strPincode = f.Pincode;
                        //        ObjCls.strMobNumber = f.Mobile_Number;
                        //        ObjCls.strEmail = f.Email_Id;
                        //        ObjCls.strPaymentMode = f.Payment_Mode;
                        //        ObjCls.decAmount = f.Amount;
                        //        ObjCls.intChequeNumber = f.DD_OR_Cheque_Number;
                        //        ObjCls.strChequeDate = string.Format("{0:dd/MM/yyyy}", f.DD_OR_Cheque_Date);
                        //        ObjCls.strPANcardNumber = f.PANcard_Number;
                        //        ObjCls.srtRecptDate = string.Format("{0:dd/MM/yyyy}", f.Receipt_Date);
                        //        lstGridEchallan.Add(ObjCls);
                        //    }
                        //}
                    }

                }
                return Json(lstGridEchallan.ToDataSourceResult(DS));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public ActionResult EchallanGrid_Read([DataSourceRequest]DataSourceRequest request)
        {
            return Json(ClsCommon.lstEchallan.ToDataSourceResult(request));
        }


        #endregion



        #region-------------------------------------EditIndividual---------------------------------------

        public JsonResult EditIndividual(int id)
        {

            try
            {
                ClsEChallan objEditEchallan = new ClsEChallan();
                List<ClsEChallan> lstEditEchallan = new List<ClsEChallan>();
                using (SaiAramFoundationEntities objEnty = new SaiAramFoundationEntities())
                {

                    var r = (from f in objEnty.T_EChallan 
                             where f.Id == id select f).FirstOrDefault();
                    if(r!=null)
                    {

                        objEditEchallan.Id = r.Id;
                        objEditEchallan.strRecptNo = r.Receipt_Number;
                        objEditEchallan.intDonartype = r.Donation_Types;
                        objEditEchallan.strNameOfDonar = r.Name_Of_Donor;
                        objEditEchallan.strAddress = r.Address;
                        objEditEchallan.strState = r.State_Name;
                        objEditEchallan.intState = r.State_Id;
                        objEditEchallan.strCountry = r.Country_Name;
                        objEditEchallan.intCountry = r.Country_Id;
                        objEditEchallan.strCity = r.City;
                        objEditEchallan.strPincode = r.Pincode;
                        objEditEchallan.strTeleNumber = r.Telephone_Number;
                        objEditEchallan.strMobNumber = r.Mobile_Number;
                        objEditEchallan.strEmail = r.Email_Id;
                        objEditEchallan.strPaymentMode = r.Payment_Mode;
                        objEditEchallan.decAmount = r.Amount;
                        objEditEchallan.strAmountInWords = r.Amount_In_Words;
                        if (objEditEchallan.strPaymentMode == "DD")
                        {
                            objEditEchallan.strDDNumber = r.DD_OR_Cheque_Number;
                            objEditEchallan.strDDDate = string.Format("{0:dd/MM/yyyy}",r.DD_OR_Cheque_Date);
                            objEditEchallan.strDDBank = r.DD_OR_Cheque_BankName;
                            objEditEchallan.strDDBranch = r.DD_OR_Cheque_Branch;
                        }

                        else if (objEditEchallan.strPaymentMode == "Cheque")
                        {
                            objEditEchallan.strChequeNumber = r.DD_OR_Cheque_Number;
                            objEditEchallan.strChequeDate = string.Format("{0:dd/MM/yyyy}", r.DD_OR_Cheque_Date);
                            objEditEchallan.strChequeBank = r.DD_OR_Cheque_BankName;
                            objEditEchallan.strChequeBranch = r.DD_OR_Cheque_Branch;
                        }
                       

                        objEditEchallan.strPANcardNumber = r.PANcard_Number;
                        objEditEchallan.strRecptDate = string.Format("{0:dd/MM/yyyy}", r.Receipt_Date);
                        lstEditEchallan.Add(objEditEchallan);
                    
                    }



                }
                return Json(lstEditEchallan, JsonRequestBehavior.AllowGet);
            }

            catch(Exception ex)
            {

                throw ex;
            
            }
        
        
        }




        #endregion




        #region-----------------------------------------Update Edit Individual-----------------------------



        [HttpPost]
        public JsonResult EditEChallan(ClsEChallan obj)
        {
           // MemoryStream objMemstrem = new MemoryStream();
            try
            {
               
                using (SaiAramFoundationEntities objEnty = new SaiAramFoundationEntities())
                {

                  var q = (from f in objEnty.T_EChallan where f.Id == obj.Id select f).FirstOrDefault();
                  if (q != null)
                  {

                     // q.Donation_Types = obj.intDonartype;
                     // q.Receipt_Number = obj.strRecptNo;
                     // q.Account_Number = AccountNumber(obj.intDonartype);
                      q.Name_Of_Donor = obj.strNameOfDonar;
                      q.Address = obj.strAddress;

                      var Country = objEnty.T_Country.Where(s => s.Id == obj.intCountry).FirstOrDefault();
                      q.Country_Id = obj.intCountry;
                      q.Country_Name = Country.Country_Name;

                      //if (strUserType == "Admin")
                      //{
                      //    tblObj.Location = obj.strLocation;
                      //}
                      //else
                      //{
                      //    tblObj.Location = (from a in objEnty.T_USER where a.Id == intUserId select a.Location).FirstOrDefault();
                      //}

                      if (obj.intState != 0)
                      {
                          var State = objEnty.T_State.Where(s => s.Id == obj.intState).FirstOrDefault();
                          q.State_Id = obj.intState;
                          q.State_Name = State.State_Name;
                      }
                      else
                      {
                          q.State_Name = obj.strState;
                      }
                      q.City = obj.strCity;
                      q.Pincode = obj.strPincode;
                      q.Email_Id = obj.strEmail;
                      q.Telephone_Number = obj.strTeleNumber;
                      q.Mobile_Number = obj.strMobNumber;
                      q.Payment_Mode = obj.strPaymentMode;
                      q.Amount = obj.decAmount;
                      q.PANcard_Number = obj.strPANcardNumber;
                      q.Receipt_Date = Convert.ToDateTime(obj.strRecptDate);
                      q.Created_Date = DateTime.Today;
                      q.Amount_In_Words = obj.strAmountInWords;
                     

                      //tblObj.Created_by = Convert.ToInt32(Session["UserId"]);
                      if (obj.strPaymentMode == "DD")
                      {
                          q.DD_OR_Cheque_Number = obj.strDDNumber;
                          q.DD_OR_Cheque_Date = Convert.ToDateTime(obj.strDDDate);
                          q.DD_OR_Cheque_BankName = obj.strDDBank;
                          q.DD_OR_Cheque_Branch = obj.strDDBranch;
                      }

                      else if (obj.strPaymentMode == "Cheque")
                      {
                          q.DD_OR_Cheque_Number = obj.strChequeNumber;
                          q.DD_OR_Cheque_Date = Convert.ToDateTime(obj.strChequeDate);
                          q.DD_OR_Cheque_BankName = obj.strChequeBank;
                          q.DD_OR_Cheque_Branch = obj.strChequeBranch;
                      }
                      else
                      {
                          q.DD_OR_Cheque_Number =null;
                          q.DD_OR_Cheque_Date =null;
                          q.DD_OR_Cheque_BankName =null;
                          q.DD_OR_Cheque_Branch =null;
                      }

                      objEnty.T_EChallan.Add(q);
                      objEnty.Entry(q).State = EntityState.Modified;
                      objEnty.SaveChanges();
                      CheckPrintReceipt("");
                  }

                }
                return Json("Success", JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }




        #endregion



        #region-----------------------------------------------Search------------------------------------------


        public JsonResult CheckPrintReceipt(string SearchKey)
        {
            ClsCommon.lstEchallan.Clear();
            try
            {
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    //if (SearchKey != "")
                    //{
                        var reportlist = ObjEnty.sp_GetReceiptDt(SearchKey).ToList();
                        if (reportlist.Count() != 0)
                        {
                            foreach (var f in reportlist)
                            {
                                ClsEChallan ObjCls = new ClsEChallan();

                                ObjCls.Id = f.Id;
                                ObjCls.strRecptNo = f.Receipt_Number;
                                ObjCls.strRecptDate = string.Format("{0:dd/MM/yyyy}", f.Receipt_Date);
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
                                ObjCls.strChequeDate = string.Format("{0:dd/MM/yyyy}", f.DD_OR_Cheque_Date);
                                ObjCls.strPANcardNumber = f.PANcard_Number;

                                ObjCls.srtRecptDate = string.Format("{0:dd/MM/yyyy}", f.Receipt_Date);
                                ClsCommon.lstEchallan.Add(ObjCls);
                            }
                            
                        //}

                    }
                    //else
                    //{
                    //    ClsCommon.lstEchallan.Clear();                        
                    //}
                    //ClsCommon.lstEchallan = ClsCommon.lstEchallan.Take(600).ToList();
                }
                return Json(ClsCommon.lstEchallan, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }




        #endregion

    }
}
