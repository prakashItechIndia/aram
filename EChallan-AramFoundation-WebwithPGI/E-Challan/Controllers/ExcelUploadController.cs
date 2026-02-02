using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using E_Challan.Models;
using LinqToExcel;
using System.Globalization;
using System.Transactions;
using System.Data.Entity.Infrastructure;

namespace E_Challan.Controllers
{
    public class ExcelUploadController : Controller
    {
        public ActionResult Create()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }
            return View();

        }

        //[HttpPost] 
        //public ActionResult Create(HttpPostedFileBase fileUpload, string button)
        //{
        //    using (Sai_EchallanEntities s = new Sai_EchallanEntities())
        //    {
        //        try
        //        {

        //            if (fileUpload != null)
        //            {
        //                if (fileUpload.ContentLength > 0)
        //                {

        //                    FileHelperEngine<ClsImport> engine = new FileHelperEngine<ClsImport>();
        //                    engine.ErrorManager.ErrorMode = ErrorMode.SaveAndContinue;
        //                    ClsImport[] res = engine.ReadStream(new StreamReader(fileUpload.InputStream));

        //                    ArrayList arr = new ArrayList();

        //                    foreach (ClsImport cust in res)
        //                    {
        //                        var RecieptId = (from a in s.T_EChallan where a.Receipt_Number == cust.Receipt_Number select a).FirstOrDefault();
        //                        if (cust.Location == "" || cust.Donation_Types == 0 || cust.StateId == 0 || cust.Address == "" || cust.MobileNumber == "" || cust.Amount == 0 || cust.PaymentMode == "" || cust.Name_of_Donor == "" || cust.CountryId == 0 || cust.City == "" || cust.Pincode == "" || cust.Email == "")
        //                        {
        //                            ClsUploadedList sh1 = new ClsUploadedList();
        //                            sh1.Receipt_Number = cust.Receipt_Number;
        //                            sh1.Donation_Types = cust.Donation_Types;

        //                            sh1.Account_Number = cust.Account_Number;
        //                            sh1.Name_of_Donor = cust.Name_of_Donor;
        //                            sh1.Address = cust.Address;

        //                            sh1.StateId = cust.StateId;
        //                            sh1.StateName = cust.StateName;

        //                            sh1.CountryId = cust.CountryId;
        //                            sh1.CountryName = cust.CountryName;
        //                            sh1.City = cust.City;
        //                            sh1.Pincode = cust.Pincode;
        //                            sh1.Telephone = cust.Telephone;
        //                            sh1.MobileNumber = cust.MobileNumber;

        //                            sh1.Email = cust.Email;
        //                            sh1.PaymentMode = cust.PaymentMode;

        //                            sh1.Amount = cust.Amount;
        //                            sh1.AmountInWords = cust.AmountInWords;

        //                            sh1.DDorChequeNumber = cust.DDorChequeNumber;
        //                            sh1.DDorChequeDate = cust.DDorChequeDate;
        //                            sh1.DDorChequeBankName = cust.DDorChequeBankName;
        //                            sh1.DDorChequeBranch = cust.DDorChequeBranch;

        //                            sh1.PANcardNumber = cust.PANcardNumber;
        //                            sh1.Location = cust.Location;
        //                            sh1.ReceiptDate = cust.ReceiptDate;
        //                            sh1.IsActive = true;
        //                            sh1.CreatedBy = 0;
        //                            sh1.CreatedDate = Convert.ToString(DateTime.Today);
        //                            sh1.Remarks = "Check Mandatory Fields";
        //                            arr.Add(sh1);

        //                        }
        //                        else if ((cust.PaymentMode == "DD" || cust.PaymentMode == "Cheque") && (cust.Amount >= 20000) && (cust.PANcardNumber == ""))
        //                        {
        //                            ClsUploadedList sh1 = new ClsUploadedList();
        //                            sh1.Receipt_Number = cust.Receipt_Number;
        //                            sh1.Donation_Types = cust.Donation_Types;

        //                            sh1.Account_Number = cust.Account_Number;
        //                            sh1.Name_of_Donor = cust.Name_of_Donor;
        //                            sh1.Address = cust.Address;

        //                            sh1.StateId = cust.StateId;
        //                            sh1.StateName = cust.StateName;

        //                            sh1.CountryId = cust.CountryId;
        //                            sh1.CountryName = cust.CountryName;
        //                            sh1.City = cust.City;
        //                            sh1.Pincode = cust.Pincode;
        //                            sh1.Telephone = cust.Telephone;
        //                            sh1.MobileNumber = cust.MobileNumber;

        //                            sh1.Email = cust.Email;
        //                            sh1.PaymentMode = cust.PaymentMode;

        //                            sh1.Amount = cust.Amount;
        //                            sh1.AmountInWords = cust.AmountInWords;

        //                            sh1.DDorChequeNumber = cust.DDorChequeNumber;
        //                            sh1.DDorChequeDate = cust.DDorChequeDate;
        //                            sh1.DDorChequeBankName = cust.DDorChequeBankName;
        //                            sh1.DDorChequeBranch = cust.DDorChequeBranch;

        //                            sh1.PANcardNumber = cust.PANcardNumber;
        //                            sh1.Location = cust.Location;
        //                            sh1.ReceiptDate = cust.ReceiptDate;
        //                            sh1.IsActive = true;
        //                            sh1.CreatedBy = 0;
        //                            sh1.CreatedDate = Convert.ToString(DateTime.Today);
        //                            sh1.Remarks = "Enter Pan Card Number";
        //                            arr.Add(sh1);
        //                        }
        //                        else if ((cust.PaymentMode == "Cash") && (cust.Amount >= 15000) && (cust.PANcardNumber == ""))
        //                        {
        //                            ClsUploadedList sh1 = new ClsUploadedList();
        //                            sh1.Receipt_Number = cust.Receipt_Number;
        //                            sh1.Donation_Types = cust.Donation_Types;

        //                            sh1.Account_Number = cust.Account_Number;
        //                            sh1.Name_of_Donor = cust.Name_of_Donor;
        //                            sh1.Address = cust.Address;

        //                            sh1.StateId = cust.StateId;
        //                            sh1.StateName = cust.StateName;

        //                            sh1.CountryId = cust.CountryId;
        //                            sh1.CountryName = cust.CountryName;
        //                            sh1.City = cust.City;
        //                            sh1.Pincode = cust.Pincode;
        //                            sh1.Telephone = cust.Telephone;
        //                            sh1.MobileNumber = cust.MobileNumber;

        //                            sh1.Email = cust.Email;
        //                            sh1.PaymentMode = cust.PaymentMode;

        //                            sh1.Amount = cust.Amount;
        //                            sh1.AmountInWords = cust.AmountInWords;

        //                            sh1.DDorChequeNumber = cust.DDorChequeNumber;
        //                            sh1.DDorChequeDate = cust.DDorChequeDate;
        //                            sh1.DDorChequeBankName = cust.DDorChequeBankName;
        //                            sh1.DDorChequeBranch = cust.DDorChequeBranch;

        //                            sh1.PANcardNumber = cust.PANcardNumber;
        //                            sh1.Location = cust.Location;
        //                            sh1.ReceiptDate = cust.ReceiptDate;
        //                            sh1.IsActive = true;
        //                            sh1.CreatedBy = 0;
        //                            sh1.CreatedDate = Convert.ToString(DateTime.Today);
        //                            sh1.Remarks = "Enter Pan Card Number";
        //                            arr.Add(sh1);
        //                        }
        //                        else if (RecieptId != null)
        //                        {
        //                            ClsUploadedList sh1 = new ClsUploadedList();
        //                            sh1.Receipt_Number = cust.Receipt_Number;
        //                            sh1.Donation_Types = cust.Donation_Types;

        //                            sh1.Account_Number = cust.Account_Number;
        //                            sh1.Name_of_Donor = cust.Name_of_Donor;
        //                            sh1.Address = cust.Address;

        //                            sh1.StateId = cust.StateId;
        //                            sh1.StateName = cust.StateName;

        //                            sh1.CountryId = cust.CountryId;
        //                            sh1.CountryName = cust.CountryName;
        //                            sh1.City = cust.City;
        //                            sh1.Pincode = cust.Pincode;
        //                            sh1.Telephone = cust.Telephone;
        //                            sh1.MobileNumber = cust.MobileNumber;

        //                            sh1.Email = cust.Email;
        //                            sh1.PaymentMode = cust.PaymentMode;

        //                            sh1.Amount = cust.Amount;
        //                            sh1.AmountInWords = cust.AmountInWords;

        //                            sh1.DDorChequeNumber = cust.DDorChequeNumber;
        //                            sh1.DDorChequeDate = cust.DDorChequeDate;
        //                            sh1.DDorChequeBankName = cust.DDorChequeBankName;
        //                            sh1.DDorChequeBranch = cust.DDorChequeBranch;

        //                            sh1.PANcardNumber = cust.PANcardNumber;
        //                            sh1.Location = cust.Location;
        //                            sh1.ReceiptDate = cust.ReceiptDate;
        //                            sh1.IsActive = true;
        //                            sh1.CreatedBy = 0;
        //                            sh1.CreatedDate = Convert.ToString(DateTime.Today);
        //                            sh1.Remarks = "Receipt Number Already Exist";
        //                            arr.Add(sh1);
        //                        }
        //                        else
        //                        {
        //                            T_EChallan sh = new T_EChallan();

        //                            sh.Receipt_Number = cust.Receipt_Number;
        //                            sh.Donation_Types = cust.Donation_Types;

        //                            sh.Account_Number = cust.Account_Number;
        //                            sh.Name_Of_Donor = cust.Name_of_Donor;
        //                            sh.Address = cust.Address;

        //                            sh.State_Id = cust.StateId;
        //                            sh.State_Name = cust.StateName;

        //                            sh.Country_Id = cust.CountryId;
        //                            sh.Country_Name = cust.CountryName;
        //                            sh.City = cust.City;
        //                            sh.Pincode = cust.Pincode;
        //                            sh.Telephone_Number = cust.Telephone;
        //                            sh.Mobile_Number = cust.MobileNumber;

        //                            sh.Email_Id = cust.Email;
        //                            sh.Payment_Mode = cust.PaymentMode;

        //                            sh.Amount = cust.Amount;
        //                            sh.Amount_In_Words = cust.AmountInWords;


        //                            if (cust.PaymentMode == "DD" || cust.PaymentMode == "Cheque")
        //                            {

        //                                sh.DD_OR_Cheque_Number = cust.DDorChequeNumber;
        //                                sh.DD_OR_Cheque_Date = Convert.ToDateTime(cust.DDorChequeDate);
        //                                sh.DD_OR_Cheque_BankName = cust.DDorChequeBankName;
        //                                sh.DD_OR_Cheque_Branch = cust.DDorChequeBranch;
        //                                if (cust.Amount >= 20000)
        //                                {
        //                                    sh.PANcard_Number = cust.PANcardNumber;
        //                                }

        //                            }

        //                            else
        //                            {
        //                                if (cust.Amount >= 15000)
        //                                {
        //                                    sh.PANcard_Number = cust.PANcardNumber;
        //                                }
        //                            }


        //                            sh.Location = cust.Location;
        //                            sh.Receipt_Date = Convert.ToDateTime(cust.ReceiptDate);
        //                            sh.Is_Active = true;
        //                            sh.Created_by = 0;
        //                            sh.Created_Date = DateTime.Today;
        //                            s.T_EChallan.Add(sh);
        //                            s.SaveChanges();
        //                        }
        //                    }

        //                    if (arr.Count != 0)
        //                    {
        //                        FileHelperEngine engine1 = new FileHelperEngine(typeof(ClsUploadedList));
        //                        Response.ContentType = "text/plain";
        //                        Response.AppendHeader("content-disposition", "attachment; filename=UnUploadedlist.csv");
        //                        Response.Write("Receipt_Number,Donation_Types,Account_Number,Name_of_Donor,Address,StateId,StateName,CountryId,CountryName,City,Pincode,Telephone,MobileNumber,Email,PaymentMode,Amount,AmountInWords,DDorChequeNumber,DDorChequeDate,DDorChequeBankName,DDorChequeBranch,PANcardNumber,Location,ReceiptDate,IsActive,CreatedBy,CreatedDate,Remarks \r\n");
        //                        engine1.WriteStream(Response.Output, arr.ToArray(typeof(ClsUploadedList)));
        //                        Response.End();
        //                    }
        //                }
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            throw ex;
        //        }

        //    }
        //    return View();
        //}


        [HttpPost]
        public ActionResult Create(ClsUploadedList obj, HttpPostedFileBase files)
        {

            List<ClsUploadedList> lstUploads = new List<ClsUploadedList>();
            List<ClsUploadedList> lstNotUploads = new List<ClsUploadedList>();
            List<ClsUploadedList> lstCorrectRecords = new List<ClsUploadedList>();
            lstUploads.Clear();
            lstNotUploads.Clear();
            lstCorrectRecords.Clear();
            string strGenerateError = "";
            int RowIdentity = 1;
            try
            {


                if (files != null)
                {
                    string fileExtension = System.IO.Path.GetExtension(files.FileName);

                    if (fileExtension == ".xls" || fileExtension == ".xlsx")
                    {

                        // Create a folder in App_Data named ExcelFiles because you need to save the file temporarily location and getting data from there. 
                        if (System.IO.File.Exists(Server.MapPath("~/Upload Files/" + files.FileName)))
                            System.IO.File.Delete(Server.MapPath("~/Upload Files/" + files.FileName));

                        files.SaveAs(Server.MapPath("~/Upload Files/" + files.FileName));
                        string sheetName = "Sheet1";
                        var excelFile = new ExcelQueryFactory(Server.MapPath("~/Upload Files/" + files.FileName));
                        IQueryable<Row> rowTemplateValues = from a in excelFile.Worksheet(sheetName) select a;

                        lstUploads = new List<ClsUploadedList>();

                        lstUploads = ExcelToList(rowTemplateValues);

                       // using (TransactionScope transaction = new TransactionScope())
                       // {
                            try
                            {

                                using (SaiAramFoundationEntities s = new SaiAramFoundationEntities())
                                {
                                    ((IObjectContextAdapter)s).ObjectContext.CommandTimeout =600;

                                    T_EChallan objTbl = new T_EChallan();

                                    foreach (ClsUploadedList cust in lstUploads)
                                    {
                                        RowIdentity = RowIdentity + 1;
                                        if (cust.Address == "" || cust.MobileNumber == "" || cust.Amount == 0 || cust.PaymentMode == "" || cust.Name_of_Donor == "" || cust.City == "" || cust.Pincode == "" || cust.Email == "" || cust.StateName == "" || cust.CountryName == "" || cust.StateName == null || cust.CountryName == null || cust.DonationCode == null || cust.DonationCode == "" || cust.AmountInWords == "" || cust.AmountInWords == null || cust.ReceiptDate == "" || cust.ReceiptDate == null)
                                        {
                                            ClsUploadedList sh1 = new ClsUploadedList();
                                            //sh1.Receipt_Number = cust.Receipt_Number;
                                            sh1.DonationCode = cust.DonationCode;
                                            sh1.Account_Number = cust.Account_Number;
                                            sh1.Name_of_Donor = cust.Name_of_Donor;
                                            sh1.Address = cust.Address;
                                            sh1.StateId = cust.StateId;
                                            sh1.StateName = cust.StateName;
                                            sh1.CountryId = cust.CountryId;
                                            sh1.CountryName = cust.CountryName;
                                            sh1.City = cust.City;
                                            sh1.Pincode = cust.Pincode;
                                            sh1.Telephone = cust.Telephone;
                                            sh1.MobileNumber = cust.MobileNumber;
                                            sh1.Email = cust.Email;
                                            sh1.PaymentMode = cust.PaymentMode;
                                            sh1.Amount = cust.Amount;
                                            sh1.AmountInWords = cust.AmountInWords;
                                            sh1.strDDorChequeNumber = cust.strDDorChequeNumber;
                                            sh1.DDorChequeDate = cust.DDorChequeDate;
                                            sh1.DDorChequeBankName = cust.DDorChequeBankName;
                                            sh1.DDorChequeBranch = cust.DDorChequeBranch;
                                            sh1.PANcardNumber = cust.PANcardNumber;
                                            //sh1.Location = cust.Location;
                                            sh1.ReceiptDate = cust.ReceiptDate;
                                            sh1.IsActive = true;
                                            sh1.CreatedBy = Convert.ToInt32(Session["UserId"]);
                                            sh1.CreatedDate = Convert.ToString(DateTime.Today);
                                            sh1.Remarks = "Check Mandatory Fields";
                                            strGenerateError = strGenerateError + "<tr><td>" + cust.DonationCode + "</td><td>" + cust.Name_of_Donor + "</td><td>" + cust.Email + "</td><td>" + cust.ReceiptDate + "</td><td>" + cust.PaymentMode + "</td><td>" + sh1.Remarks + "</td><td>" + RowIdentity + "</td></tr>";
                                            //strGenerateError = cust.DonationCode + "," + cust.Name_of_Donor + "," + cust.Email + "," + cust.ReceiptDate + "," + sh1.Remarks + "</br>";
                                            lstNotUploads.Add(sh1);

                                        }

                                        else if (cust.StateId == 0 || cust.CountryId == 0)
                                        {
                                            ClsUploadedList sh1 = new ClsUploadedList();
                                            //sh1.Receipt_Number = cust.Receipt_Number;
                                            sh1.DonationCode = cust.DonationCode;
                                            sh1.Account_Number = cust.Account_Number;
                                            sh1.Name_of_Donor = cust.Name_of_Donor;
                                            sh1.Address = cust.Address;
                                            sh1.StateId = cust.StateId;
                                            sh1.StateName = cust.StateName;
                                            sh1.CountryId = cust.CountryId;
                                            sh1.CountryName = cust.CountryName;
                                            sh1.City = cust.City;
                                            sh1.Pincode = cust.Pincode;
                                            sh1.Telephone = cust.Telephone;
                                            sh1.MobileNumber = cust.MobileNumber;
                                            sh1.Email = cust.Email;
                                            sh1.PaymentMode = cust.PaymentMode;
                                            sh1.Amount = cust.Amount;
                                            sh1.AmountInWords = cust.AmountInWords;
                                            sh1.strDDorChequeNumber = cust.strDDorChequeNumber;
                                            sh1.DDorChequeDate = cust.DDorChequeDate;
                                            sh1.DDorChequeBankName = cust.DDorChequeBankName;
                                            sh1.DDorChequeBranch = cust.DDorChequeBranch;
                                            sh1.PANcardNumber = cust.PANcardNumber;
                                            // sh1.Location = cust.Location;
                                            sh1.ReceiptDate = cust.ReceiptDate;
                                            sh1.IsActive = true;
                                            sh1.CreatedBy = Convert.ToInt32(Session["UserId"]);
                                            sh1.CreatedDate = Convert.ToString(DateTime.Today);
                                            sh1.Remarks = "Please check the spelling for (Country or State Name)";
                                            strGenerateError = strGenerateError + "<tr><td>" + cust.DonationCode + "</td><td>" + cust.Name_of_Donor + "</td><td>" + cust.Email + "</td><td>" + cust.ReceiptDate + "</td><td>" + cust.PaymentMode + "</td><td>" + sh1.Remarks + "</td><td>" + RowIdentity + "</td></tr>";
                                            // strGenerateError = cust.DonationCode + "," + cust.Name_of_Donor + "," + cust.Email + "," + cust.ReceiptDate + "," + sh1.Remarks + "</br>";
                                            lstNotUploads.Add(sh1);
                                        }

                                        else if ((cust.PaymentMode.ToUpper().Trim() == "DD" || cust.PaymentMode.ToUpper().Trim() == "CHEQUE") && (cust.strDDorChequeNumber == null || cust.strDDorChequeNumber == "" || cust.DDorChequeDate == "" || cust.DDorChequeDate == null || cust.DDorChequeBankName == null || cust.DDorChequeBankName == ""))
                                        {
                                            ClsUploadedList sh1 = new ClsUploadedList();
                                            //sh1.Receipt_Number = cust.Receipt_Number;
                                            sh1.DonationCode = cust.DonationCode;
                                            sh1.Account_Number = cust.Account_Number;
                                            sh1.Name_of_Donor = cust.Name_of_Donor;
                                            sh1.Address = cust.Address;
                                            sh1.StateId = cust.StateId;
                                            sh1.StateName = cust.StateName;
                                            sh1.CountryId = cust.CountryId;
                                            sh1.CountryName = cust.CountryName;
                                            sh1.City = cust.City;
                                            sh1.Pincode = cust.Pincode;
                                            sh1.Telephone = cust.Telephone;
                                            sh1.MobileNumber = cust.MobileNumber;
                                            sh1.Email = cust.Email;
                                            sh1.PaymentMode = cust.PaymentMode;
                                            sh1.Amount = cust.Amount;
                                            sh1.AmountInWords = cust.AmountInWords;
                                            sh1.strDDorChequeNumber = cust.strDDorChequeNumber;
                                            sh1.DDorChequeDate = cust.DDorChequeDate;
                                            sh1.DDorChequeBankName = cust.DDorChequeBankName;
                                            sh1.DDorChequeBranch = cust.DDorChequeBranch;
                                            sh1.PANcardNumber = cust.PANcardNumber;
                                            // sh1.Location = cust.Location;
                                            sh1.ReceiptDate = cust.ReceiptDate;
                                            sh1.IsActive = true;
                                            sh1.CreatedBy = Convert.ToInt32(Session["UserId"]);
                                            sh1.CreatedDate = Convert.ToString(DateTime.Today);
                                            sh1.Remarks = "Check DD/Cheque (Date or Number or Branch)";
                                            strGenerateError = strGenerateError + "<tr><td>" + cust.DonationCode + "</td><td>" + cust.Name_of_Donor + "</td><td>" + cust.Email + "</td><td>" + cust.ReceiptDate + "</td><td>" + cust.PaymentMode + "</td><td>" + sh1.Remarks + "</td><td>" + RowIdentity + "</td></tr>";
                                            // strGenerateError = cust.DonationCode + "," + cust.Name_of_Donor + "," + cust.Email + "," + cust.ReceiptDate + "," + sh1.Remarks + "</br>";
                                            lstNotUploads.Add(sh1);
                                        }

                                        else if ((cust.PaymentMode.ToUpper().Trim() == "DD" || cust.PaymentMode.ToUpper().Trim() == "CHEQUE") && (cust.strDDorChequeNumber != null || cust.strDDorChequeNumber != "" || cust.DDorChequeDate != "" || cust.DDorChequeDate != null || cust.DDorChequeBankName != null || cust.DDorChequeBankName != ""))
                                        {
                                            ClsUploadedList sh1 = new ClsUploadedList();
                                            //sh1.Receipt_Number = cust.Receipt_Number;
                                            sh1.DonationCode = cust.DonationCode;
                                            sh1.Donation_Types = cust.Donation_Types;
                                            sh1.Account_Number = cust.Account_Number;
                                            sh1.Name_of_Donor = cust.Name_of_Donor;
                                            sh1.Address = cust.Address;
                                            sh1.StateId = cust.StateId;
                                            sh1.StateName = cust.StateName;
                                            sh1.CountryId = cust.CountryId;
                                            sh1.CountryName = cust.CountryName;
                                            sh1.City = cust.City;
                                            sh1.Pincode = cust.Pincode;
                                            sh1.Telephone = cust.Telephone;
                                            sh1.MobileNumber = cust.MobileNumber;
                                            sh1.Email = cust.Email;
                                            sh1.PaymentMode = cust.PaymentMode;
                                            sh1.Amount = cust.Amount;
                                            sh1.AmountInWords = cust.AmountInWords;
                                            sh1.strDDorChequeNumber = cust.strDDorChequeNumber;
                                            sh1.DDorChequeDate = cust.DDorChequeDate;
                                            sh1.DDorChequeBankName = cust.DDorChequeBankName;
                                            sh1.DDorChequeBranch = cust.DDorChequeBranch;
                                            sh1.PANcardNumber = cust.PANcardNumber;
                                            // sh1.Location = cust.Location;
                                            sh1.ReceiptDate = cust.ReceiptDate;
                                            sh1.IsActive = true;
                                            sh1.CreatedBy = Convert.ToInt32(Session["UserId"]);
                                            sh1.CreatedDate = Convert.ToString(DateTime.Today);

                                            bool checkdate = ValidateDate(cust.DDorChequeDate);
                                            if (checkdate == true)
                                            {
                                                lstCorrectRecords.Add(sh1);
                                            }
                                            else
                                            {

                                                sh1.Remarks = "Check DD/Cheque date format.Format should be dd/MM/yyyy";
                                                strGenerateError = strGenerateError + "<tr><td>" + cust.DonationCode + "</td><td>" + cust.Name_of_Donor + "</td><td>" + cust.Email + "</td><td>" + cust.ReceiptDate + "</td><td>" + cust.PaymentMode + "</td><td>" + sh1.Remarks + "</td><td>" + RowIdentity + "</td></tr>";
                                                // strGenerateError = cust.DonationCode + "," + cust.Name_of_Donor + "," + cust.Email + "," + cust.ReceiptDate + "," + sh1.Remarks + "</br>";
                                                lstNotUploads.Add(sh1);
                                            }
                                        }


                                        else if ((cust.ReceiptDate != null || cust.ReceiptDate != ""))
                                        {
                                            ClsUploadedList sh1 = new ClsUploadedList();
                                            //sh1.Receipt_Number = cust.Receipt_Number;
                                            sh1.DonationCode = cust.DonationCode;
                                            sh1.Donation_Types = cust.Donation_Types;
                                            sh1.Account_Number = cust.Account_Number;
                                            sh1.Name_of_Donor = cust.Name_of_Donor;
                                            sh1.Address = cust.Address;
                                            sh1.StateId = cust.StateId;
                                            sh1.StateName = cust.StateName;
                                            sh1.CountryId = cust.CountryId;
                                            sh1.CountryName = cust.CountryName;
                                            sh1.City = cust.City;
                                            sh1.Pincode = cust.Pincode;
                                            sh1.Telephone = cust.Telephone;
                                            sh1.MobileNumber = cust.MobileNumber;
                                            sh1.Email = cust.Email;
                                            sh1.PaymentMode = cust.PaymentMode;
                                            sh1.Amount = cust.Amount;
                                            sh1.AmountInWords = cust.AmountInWords;
                                            sh1.strDDorChequeNumber = cust.strDDorChequeNumber;
                                            sh1.DDorChequeDate = cust.DDorChequeDate;
                                            sh1.DDorChequeBankName = cust.DDorChequeBankName;
                                            sh1.DDorChequeBranch = cust.DDorChequeBranch;
                                            sh1.PANcardNumber = cust.PANcardNumber;
                                            // sh1.Location = cust.Location;
                                            sh1.ReceiptDate = cust.ReceiptDate;
                                            sh1.IsActive = true;
                                            sh1.CreatedBy = Convert.ToInt32(Session["UserId"]);
                                            sh1.CreatedDate = Convert.ToString(DateTime.Today);


                                            bool checkdate = ValidateDate(cust.ReceiptDate);
                                            if (checkdate == true)
                                            {
                                                lstCorrectRecords.Add(sh1);
                                            }
                                            else
                                            {

                                                sh1.Remarks = "Check Receipt date format.Format should be dd/MM/yyyy";
                                                strGenerateError = strGenerateError + "<tr><td>" + cust.DonationCode + "</td><td>" + cust.Name_of_Donor + "</td><td>" + cust.Email + "</td><td>" + cust.ReceiptDate + "</td><td>" + cust.PaymentMode + "</td><td>" + sh1.Remarks + "</td><td>" + RowIdentity + "</td></tr>";
                                                // strGenerateError = cust.DonationCode + "," + cust.Name_of_Donor + "," + cust.Email + "," + cust.ReceiptDate + "," + sh1.Remarks + "</br>";
                                                lstNotUploads.Add(sh1);
                                            }
                                        }


                                        else if ((cust.PaymentMode.ToUpper().Trim() == "DD" || cust.PaymentMode.ToUpper().Trim() == "CHEQUE") && (cust.Amount >= 20000) && (cust.PANcardNumber == ""))
                                        {
                                            ClsUploadedList sh1 = new ClsUploadedList();
                                            //sh1.Receipt_Number = cust.Receipt_Number;
                                            sh1.DonationCode = cust.DonationCode;
                                            sh1.Account_Number = cust.Account_Number;
                                            sh1.Name_of_Donor = cust.Name_of_Donor;
                                            sh1.Address = cust.Address;
                                            sh1.StateId = cust.StateId;
                                            sh1.StateName = cust.StateName;
                                            sh1.CountryId = cust.CountryId;
                                            sh1.CountryName = cust.CountryName;
                                            sh1.City = cust.City;
                                            sh1.Pincode = cust.Pincode;
                                            sh1.Telephone = cust.Telephone;
                                            sh1.MobileNumber = cust.MobileNumber;
                                            sh1.Email = cust.Email;
                                            sh1.PaymentMode = cust.PaymentMode;
                                            sh1.Amount = cust.Amount;
                                            sh1.AmountInWords = cust.AmountInWords;
                                            sh1.strDDorChequeNumber = cust.strDDorChequeNumber;
                                            sh1.DDorChequeDate = cust.DDorChequeDate;
                                            sh1.DDorChequeBankName = cust.DDorChequeBankName;
                                            sh1.DDorChequeBranch = cust.DDorChequeBranch;
                                            sh1.PANcardNumber = cust.PANcardNumber;
                                            // sh1.Location = cust.Location;
                                            sh1.ReceiptDate = cust.ReceiptDate;
                                            sh1.IsActive = true;
                                            sh1.CreatedBy = Convert.ToInt32(Session["UserId"]);
                                            sh1.CreatedDate = Convert.ToString(DateTime.Today);
                                            sh1.Remarks = "Enter Pan Card Number because your amount exceeds 20000";
                                            strGenerateError = strGenerateError + "<tr><td>" + cust.DonationCode + "</td><td>" + cust.Name_of_Donor + "</td><td>" + cust.Email + "</td><td>" + cust.ReceiptDate + "</td><td>" + cust.PaymentMode + "</td><td>" + sh1.Remarks + "</td><td>" + RowIdentity + "</td></tr>";
                                            // strGenerateError = cust.DonationCode + "," + cust.Name_of_Donor + "," + cust.Email + "," + cust.ReceiptDate + "," + sh1.Remarks + "</br>";
                                            lstNotUploads.Add(sh1);
                                        }
                                        else if ((cust.PaymentMode.ToUpper().Trim() == "CASH") && (cust.Amount >= 15000) && (cust.PANcardNumber == ""))
                                        {
                                            ClsUploadedList sh1 = new ClsUploadedList();
                                            //sh1.Receipt_Number = cust.Receipt_Number;
                                            sh1.DonationCode = cust.DonationCode;
                                            sh1.Account_Number = cust.Account_Number;
                                            sh1.Name_of_Donor = cust.Name_of_Donor;
                                            sh1.Address = cust.Address;
                                            sh1.StateId = cust.StateId;
                                            sh1.StateName = cust.StateName;
                                            sh1.CountryId = cust.CountryId;
                                            sh1.CountryName = cust.CountryName;
                                            sh1.City = cust.City;
                                            sh1.Pincode = cust.Pincode;
                                            sh1.Telephone = cust.Telephone;
                                            sh1.MobileNumber = cust.MobileNumber;
                                            sh1.Email = cust.Email;
                                            sh1.PaymentMode = cust.PaymentMode;
                                            sh1.Amount = cust.Amount;
                                            sh1.AmountInWords = cust.AmountInWords;
                                            sh1.strDDorChequeNumber = cust.strDDorChequeNumber;
                                            sh1.DDorChequeDate = cust.DDorChequeDate;
                                            sh1.DDorChequeBankName = cust.DDorChequeBankName;
                                            sh1.DDorChequeBranch = cust.DDorChequeBranch;
                                            sh1.PANcardNumber = cust.PANcardNumber;
                                            //  sh1.Location = cust.Location;
                                            sh1.ReceiptDate = cust.ReceiptDate;
                                            sh1.IsActive = true;
                                            sh1.CreatedBy = Convert.ToInt32(Session["UserId"]);
                                            sh1.CreatedDate = Convert.ToString(DateTime.Today);
                                            sh1.Remarks = "Enter Pan Card Number because your amount exceeds 15000";
                                            strGenerateError = strGenerateError + "<tr><td>" + cust.DonationCode + "</td><td>" + cust.Name_of_Donor + "</td><td>" + cust.Email + "</td><td>" + cust.ReceiptDate + "</td><td>" + cust.PaymentMode + "</td><td>" + sh1.Remarks + "</td><td>" + RowIdentity + "</td></tr>";
                                            // strGenerateError = cust.DonationCode + "," + cust.Name_of_Donor + "," + cust.Email + "," + cust.ReceiptDate + "," + sh1.Remarks + "</br>";
                                            lstNotUploads.Add(sh1);
                                        }

                                        else if (cust.Donation_Types == 0)
                                        {
                                            ClsUploadedList sh1 = new ClsUploadedList();
                                            //sh1.Receipt_Number = cust.Receipt_Number;
                                            sh1.DonationCode = cust.DonationCode;
                                            sh1.Account_Number = cust.Account_Number;
                                            sh1.Name_of_Donor = cust.Name_of_Donor;
                                            sh1.Address = cust.Address;
                                            sh1.StateId = cust.StateId;
                                            sh1.StateName = cust.StateName;
                                            sh1.CountryId = cust.CountryId;
                                            sh1.CountryName = cust.CountryName;
                                            sh1.City = cust.City;
                                            sh1.Pincode = cust.Pincode;
                                            sh1.Telephone = cust.Telephone;
                                            sh1.MobileNumber = cust.MobileNumber;
                                            sh1.Email = cust.Email;
                                            sh1.PaymentMode = cust.PaymentMode;
                                            sh1.Amount = cust.Amount;
                                            sh1.AmountInWords = cust.AmountInWords;
                                            sh1.strDDorChequeNumber = cust.strDDorChequeNumber;
                                            sh1.DDorChequeDate = cust.DDorChequeDate;
                                            sh1.DDorChequeBankName = cust.DDorChequeBankName;
                                            sh1.DDorChequeBranch = cust.DDorChequeBranch;
                                            sh1.PANcardNumber = cust.PANcardNumber;
                                            // sh1.Location = cust.Location;
                                            sh1.ReceiptDate = cust.ReceiptDate;
                                            sh1.IsActive = true;
                                            sh1.CreatedBy = Convert.ToInt32(Session["UserId"]);
                                            sh1.CreatedDate = Convert.ToString(DateTime.Today);
                                            sh1.Remarks = "Enter Valid Donation Code";
                                            strGenerateError = strGenerateError + "<tr><td>" + cust.DonationCode + "</td><td>" + cust.Name_of_Donor + "</td><td>" + cust.Email + "</td><td>" + cust.ReceiptDate + "</td><td>" + cust.PaymentMode + "</td><td>" + sh1.Remarks + "</td><td>" + RowIdentity + "</td></tr>";
                                            //  strGenerateError = cust.DonationCode + "," + cust.Name_of_Donor + "," + cust.Email + "," + cust.ReceiptDate + "," + sh1.Remarks + "</br>";
                                            lstNotUploads.Add(sh1);
                                        }

                                        else
                                        {
                                            ClsUploadedList sh1 = new ClsUploadedList();
                                            //sh1.Receipt_Number = cust.Receipt_Number;
                                            sh1.DonationCode = cust.DonationCode;
                                            sh1.Donation_Types = cust.Donation_Types;
                                            sh1.Account_Number = cust.Account_Number;
                                            sh1.Name_of_Donor = cust.Name_of_Donor;
                                            sh1.Address = cust.Address;
                                            sh1.StateId = cust.StateId;
                                            sh1.StateName = cust.StateName;
                                            sh1.CountryId = cust.CountryId;
                                            sh1.CountryName = cust.CountryName;
                                            sh1.City = cust.City;
                                            sh1.Pincode = cust.Pincode;
                                            sh1.Telephone = cust.Telephone;
                                            sh1.MobileNumber = cust.MobileNumber;
                                            sh1.Email = cust.Email;
                                            sh1.PaymentMode = cust.PaymentMode;
                                            sh1.Amount = cust.Amount;
                                            sh1.AmountInWords = cust.AmountInWords;
                                            sh1.strDDorChequeNumber = cust.strDDorChequeNumber;
                                            sh1.DDorChequeDate = cust.DDorChequeDate;
                                            sh1.DDorChequeBankName = cust.DDorChequeBankName;
                                            sh1.DDorChequeBranch = cust.DDorChequeBranch;
                                            sh1.PANcardNumber = cust.PANcardNumber;
                                            // sh1.Location = cust.Location;
                                            sh1.ReceiptDate = cust.ReceiptDate;
                                            sh1.IsActive = true;
                                            sh1.CreatedBy = Convert.ToInt32(Session["UserId"]);
                                            sh1.CreatedDate = Convert.ToString(DateTime.Today);
                                            // sh1.Remarks = "Enter Valid Donation Code";
                                            //strGenerateError = "<tr><td>" + cust.DonationCode + "</td><td>" + cust.Name_of_Donor + "</td><td>" + cust.Email + "</td><td>" + cust.ReceiptDate + "</td><td>" + sh1.Remarks + "</td><td>" + RowIdentity + "</td></tr>";
                                            //  strGenerateError = cust.DonationCode + "," + cust.Name_of_Donor + "," + cust.Email + "," + cust.ReceiptDate + "," + sh1.Remarks + "</br>";
                                            lstCorrectRecords.Add(sh1);

                                        }




                                    }


                                    //Inserting to database

                                    if (lstNotUploads.Count == 0 && lstCorrectRecords.Count != 0)
                                    {
                                        foreach (var cust in lstCorrectRecords)
                                        {
                                            T_EChallan sh = new T_EChallan();

                                            // sh.Receipt_Number = cust.Receipt_Number;
                                            sh.Donation_Types = cust.Donation_Types;
                                            sh.Account_Number = cust.Account_Number;
                                            sh.Name_Of_Donor = cust.Name_of_Donor;
                                            sh.Address = cust.Address;
                                            sh.State_Id = cust.StateId;
                                            sh.State_Name = cust.StateName;
                                            sh.Country_Id = cust.CountryId;
                                            sh.Country_Name = cust.CountryName;
                                            sh.City = cust.City;
                                            sh.Pincode = cust.Pincode;
                                            sh.Telephone_Number = cust.Telephone;
                                            sh.Mobile_Number = cust.MobileNumber;
                                            sh.Email_Id = cust.Email;
                                            sh.Payment_Mode = cust.PaymentMode;
                                            sh.Amount = cust.Amount;
                                            sh.Amount_In_Words = cust.AmountInWords;


                                            if (cust.PaymentMode.Trim().ToUpper() == "DD" || cust.PaymentMode.Trim().ToUpper() == "CHEQUE")
                                            {

                                                sh.DD_OR_Cheque_Number = cust.strDDorChequeNumber;
                                                sh.DD_OR_Cheque_Date = Convert.ToDateTime(cust.DDorChequeDate);
                                                sh.DD_OR_Cheque_BankName = cust.DDorChequeBankName;
                                                sh.DD_OR_Cheque_Branch = cust.DDorChequeBranch;
                                                if (cust.Amount >= 20000)
                                                {
                                                    sh.PANcard_Number = cust.PANcardNumber;
                                                }

                                            }

                                            else
                                            {
                                                if (cust.Amount >= 15000)
                                                {
                                                    sh.PANcard_Number = cust.PANcardNumber;
                                                }
                                            }


                                            // sh.Location = cust.Location;
                                            sh.Receipt_Date = Convert.ToDateTime(cust.ReceiptDate);
                                            sh.Is_Active = true;
                                            sh.Created_by = Convert.ToInt32(Session["UserId"]);
                                            sh.Created_Date = DateTime.Today;
                                            sh.Type = "Excel";
                                            sh.Receipt_Number = ReceiptNumber(cust.Donation_Types);
                                            s.T_EChallan.Add(sh);
                                            s.SaveChanges();

                                        }
                                      //  transaction.Complete();
                                        ViewData["statusMsg"] = "Success";
                                        ViewData["alertclass"] = "success";
                                        strGenerateError = "";
                                    }



                                    //if (lstNotUploads.Count != 0)
                                    //{
                                    //    List<string> lstFilterColumns = new List<string>() { "Receipt_Number", "StateId", "CountryId", "IsActive", "CreatedBy", "CreatedDate", "Donation_Types", "Account_Number" };

                                    //    //Return the result to the end user
                                    //    byte[] byteExport = ClsCommon.ToExport(lstNotUploads, lstFilterColumns);
                                    //    ViewData["UploadedCount"] = lstUploads.Count - lstNotUploads.Count;
                                    //    ViewData["UnuploadedCount"] = lstNotUploads.Count;
                                    //    return File(byteExport,   //The binary data of the XLS file
                                    //         "application/vnd.ms-excel", //MIME type of Excel files
                                    //         "EChallanExcelExport.xls");     //Suggested file name in the "Save as" dialog which will be displayed to the end user


                                    //}
                                }
                            }
                            catch (Exception ex)
                            {
                              // transaction.Dispose();
                                throw ex;
                            }
                       // }
                    }
                }

                //ViewBag.test =  "<tr><td>" + strGenerateError + "</td><td>ssf</td></tr>";
                ViewBag.test = strGenerateError;
                return View();

            }
            catch (Exception ex)
            {
                ViewData["Error"] = "WrongFormat";
                return View();
            }
           
        }
        //------ExcelToList-----

        private List<ClsUploadedList> ExcelToList(IQueryable<Row> rowTemplateValues)
        {

            List<ClsUploadedList> lstUploads = new List<ClsUploadedList>();

            try
            {
                using (SaiAramFoundationEntities Enty = new SaiAramFoundationEntities())
                {

                    foreach (Row row in rowTemplateValues)
                    {
                        ClsUploadedList objUpload = new ClsUploadedList();

                        string Dtype = row[0].ToString().Trim();
                        string strState = row[3].ToString().Trim();
                        string strCountry = row[4].ToString().Trim();
                        int DonationTypes = 0;
                        string AccNo = "";

                        var q = (from a in Enty.T_DONOR_CATEGORIES where Dtype.Contains(a.Donation_Code.Trim()) select a).FirstOrDefault();
                        if (q != null)
                        {
                            DonationTypes = q.Id;
                            AccNo = q.Account_Number;
                        }

                        strState = new string(strState.ToList().Where(c => c != ' ').ToArray());
                        int State = (from a in Enty.T_State where strState.Trim()==(a.State_Name.Trim()) select a.Id).FirstOrDefault();
                        int Country = (from a in Enty.T_Country where strCountry==(a.Country_Name.Trim()) select a.Id).FirstOrDefault();

                        if (DonationTypes != 0)
                        {
                            objUpload.Donation_Types = DonationTypes;
                            objUpload.DonationCode = Dtype;
                        }
                        else
                        {
                            objUpload.DonationCode = Dtype;
                        }

                        objUpload.Account_Number = AccNo;


                        //row[1].ToString();
                        objUpload.Name_of_Donor = row[1].ToString();
                        objUpload.Address = row[2].ToString();

                        if (State != 0)
                        {
                            objUpload.StateId = State;
                            objUpload.StateName = strState;
                        }
                        else
                        {
                            objUpload.StateName = row[3].ToString().Trim();
                        }

                        if (Country != 0)
                        {
                            objUpload.CountryId = Country;
                            objUpload.CountryName = strCountry;
                        }
                        else
                        {
                            objUpload.CountryName = row[4].ToString().Trim();
                        }

                        objUpload.City = row[5].ToString();
                        objUpload.Pincode = row[6].ToString();
                        objUpload.Telephone = row[7].ToString();
                        objUpload.MobileNumber = row[8].ToString();
                        objUpload.Email = row[9].ToString();
                        objUpload.PaymentMode = row[10].ToString();
                        if (row[11] != "" && row[11] != null)
                        {
                            objUpload.Amount = Convert.ToDecimal(row[11]);
                        }
                        int amounts = Convert.ToInt32(objUpload.Amount);
                        objUpload.AmountInWords = NumberToWords(amounts) + " Only";

                        if (row[12] != "" && row[12] != null)
                        {
                            objUpload.strDDorChequeNumber = Convert.ToString(row[12].ToString());
                        }
                        objUpload.DDorChequeDate = row[13].ToString();
                        objUpload.DDorChequeBankName = row[14].ToString();
                        objUpload.DDorChequeBranch = row[15].ToString();
                        objUpload.PANcardNumber = row[16].ToString();
                       // objUpload.Location = row[18].ToString();
                        objUpload.ReceiptDate = row[17].ToString();
                        objUpload.IsActive = true;
                        objUpload.CreatedBy = Convert.ToInt32(Session["UserId"]);
                        objUpload.CreatedDate = Convert.ToString(DateTime.Today);
                        

                        lstUploads.Add(objUpload);
                    }
                    return lstUploads;
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
                string ReceiptNo = string.Empty;
                string strCode = string.Empty;
                using (SaiAramFoundationEntities objEnty = new SaiAramFoundationEntities())
                {
                    var chkdata = (from z in objEnty.T_EChallan
                                   where z.Donation_Types == intDonartype && (z.Type.Trim().ToUpper() == "EXCEL" || z.Type.Trim() .ToUpper() == "OFFLINE")
                                   select z).FirstOrDefault();

                    if (chkdata != null)
                    {

                        string rptNO = (from q in objEnty.T_EChallan
                                        where q.Donation_Types == intDonartype && (q.Type.Trim().ToUpper() == "EXCEL" || q.Type.Trim().ToUpper() == "OFFLINE")
                                        select q.Receipt_Number).DefaultIfEmpty().Max();

                        strCode = (from w in objEnty.T_DONOR_CATEGORIES where w.Id == intDonartype select w.Donation_Code).FirstOrDefault();


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


        private string NumberToWords(int number)
        {
            if (number == 0)
                return "zero";

            if (number < 0)
                return "minus " + NumberToWords(Math.Abs(number));

            string words = "";
            if ((number / 1000000000) > 0)
            {
                words += NumberToWords(number / 1000000000) + " Billion ";
                number %= 1000000000;
            }

            if ((number / 10000000) > 0)
            {
                words += NumberToWords(number / 10000000) + " Crore ";
                number %= 10000000;
            }

            if ((number / 1000000) > 0)
            {
                words += NumberToWords(number / 1000000) + " Million ";
                number %= 1000000;
            }


            if ((number / 100000) > 0)
            {
                words += NumberToWords(number / 100000) + " Lakh ";
                number %= 100000;
            }


            if ((number / 1000) > 0)
            {
                words += NumberToWords(number / 1000) + " Thousand ";
                number %= 1000;
            }

            if ((number / 100) > 0)
            {
                words += NumberToWords(number / 100) + " Hundred ";
                number %= 100;
            }

            if (number > 0)
            {
                if (words != "")
                    words += "and ";

                var unitsMap = new[] { "zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen" };
                var tensMap = new[] { "zero", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety" };

                if (number < 20)
                    words += unitsMap[number];
                else
                {
                    words += tensMap[number / 10];
                    if ((number % 10) > 0)
                        words += "-" + unitsMap[number % 10];
                }
            }

            return words;
        }


        

        private bool ValidateDate(string stringDateValue)
        {
            try
            {
               
                CultureInfo CultureInfoDateCulture = new CultureInfo("en-GB");
                DateTime d = DateTime.ParseExact(stringDateValue, "d/M/yyyy", CultureInfoDateCulture);
                return true;
            }
            catch
            {

                return false;
            }
        }

    }
}
