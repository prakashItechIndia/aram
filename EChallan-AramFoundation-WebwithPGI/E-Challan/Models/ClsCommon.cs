using NPOI.HSSF.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Mvc;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Net.Mail;
using System.Data;
using System.Text;
using System.IO;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using System.Configuration;
using E_Challan.Models;
using NPOI.SS.UserModel;


namespace E_Challan.Models
{
    public class ClsCommon
    {

        public static List<ClsUser> lstUser = new List<ClsUser>();
        public static List<ClsDonorCategories> lstDonorCategories = new List<ClsDonorCategories>();
        public static List<ClsEChallanReport> lstEchallanReport = new List<ClsEChallanReport>();
        public static List<ClsLogHistory> lstLogHistory = new List<ClsLogHistory>();
        public static List<ClsEChallan> lstEchallan = new List<ClsEChallan>();

        public static void Mail(string Email,string Password)
        {
            try
            {
                MailMessage mail = new MailMessage();
                SmtpClient emailClient = new SmtpClient();               
                emailClient.Host = "mail.itech-india.com";
                mail.From = new MailAddress("aramechallan@sairamgroup.in");
                mail.Bcc.Add("test@itech-india.com");
                mail.To.Add(Email);
                mail.IsBodyHtml = true;
                mail.Subject = "E-Challan:ForgetPassword !";
                mail.Body = "Dear Sir/Madam,<br/><br/>Your Password :" + Password + "<br/><br/>Thanks,<br/>Admin<br/>";
                emailClient.Send(mail);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #region "---------Log History--------------"

        public static void LogHistory(int EChallanId,string Type,int DoneBy)
        {
            try
            {
                using (SaiAramFoundationEntities ObjEnty=new SaiAramFoundationEntities())
                {
                    T_User_Activites tblObj = new T_User_Activites();
                    tblObj.EChallan_Id = EChallanId;
                    tblObj.Type = Type;
                    tblObj.Done_By = DoneBy;
                    tblObj.CurrentDate = DateTime.Today.ToShortDateString();
                    tblObj.CurrentTime = DateTime.Now.ToLongTimeString();
                    ObjEnty.T_User_Activites.Add(tblObj);
                    ObjEnty.SaveChanges();
                }               
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion


        #region---------------------------Encrypt,Decrypt Password---------------------------


        public static string Encryptdata(string password)
        {
            string strmsg = string.Empty;
            byte[] encode = new byte[password.Length];
            encode = Encoding.UTF8.GetBytes(password);
            strmsg = Convert.ToBase64String(encode);
            return strmsg;
        }

        public static string Decryptdata(string encryptpwd)
        {
            string decryptpwd = string.Empty;
            UTF8Encoding encodepwd = new UTF8Encoding();
            Decoder Decode = encodepwd.GetDecoder();
            byte[] todecode_byte = Convert.FromBase64String(encryptpwd);
            int charCount = Decode.GetCharCount(todecode_byte, 0, todecode_byte.Length);
            char[] decoded_char = new char[charCount];
            Decode.GetChars(todecode_byte, 0, todecode_byte.Length, decoded_char, 0);
            decryptpwd = new String(decoded_char);
            return decryptpwd;
        }



        #endregion




        #region---------------------Report Excel (ToReport function)-------------------

        public static byte[] ToExport<T>(List<T> items, List<string> FilterColumns = null)
        {
            //http://www.codeproject.com/Tips/406704/Export-DataTable-to-Excel-with-Formatting-in-Cshar

            //Create new Excel workbook
            var workbook = new HSSFWorkbook();

            //Create new Excel sheet
            var sheet = workbook.CreateSheet();

            //(Optional) set the width of the columns

            //Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            for (int i = 0; i < Props.Length; i++)
            {

                if (FilterColumns != null)
                {
                    if (!FilterColumns.Contains((Props[i].Name)))
                    {
                        //(Optional) set the width of the columns
                        sheet.SetColumnWidth(i, 50 * 256);
                    }
                }
                else
                {
                    sheet.SetColumnWidth(i, 50 * 256);
                }



            }
            
            //Create a header row
            var headerRow = sheet.CreateRow(0);
            var font = workbook.CreateFont();
            font.FontHeightInPoints = 11;
            font.FontName = "Calibri";
            
           //font.Color = (short)(FontColor.None);
                                                                                                                                                                                                                                                                    
            font.Color = NPOI.HSSF.Util.HSSFColor.YELLOW.index;
            font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.BOLD;
             
            for (int i = 0; i < Props.Length; i++)
            {
                if (FilterColumns != null)
                {
                    if (!FilterColumns.Contains((Props[i].Name)))
                    {
                        //Set the column names in the header row
                        var cell = headerRow.CreateCell(i);

                        cell.SetCellValue(Props[i].Name);
                        cell.CellStyle = workbook.CreateCellStyle();
                        cell.CellStyle.SetFont(font);
                        if (i == 7 || i == 13 || i == 14 || i == 15 || i == 16 || i == 17)
                        {
                            cell.CellStyle.FillBackgroundColor = NPOI.HSSF.Util.HSSFColor.YELLOW.index;
                            cell.CellStyle.FillForegroundColor = NPOI.HSSF.Util.HSSFColor.GREEN.index;
                            
                            cell.CellStyle.FillPattern = FillPatternType.SOLID_FOREGROUND;
                        }
                        else
                        {

                            cell.CellStyle.FillBackgroundColor = NPOI.HSSF.Util.HSSFColor.YELLOW.index;
                            cell.CellStyle.FillForegroundColor = NPOI.HSSF.Util.HSSFColor.RED.index;
                            cell.CellStyle.FillPattern = FillPatternType.SOLID_FOREGROUND;          
                        
                        }
                        
                    }
                }
                else
                {
                    //Set the column names in the header row
                    var cell = headerRow.CreateCell(i);

                    cell.SetCellValue(Props[i].Name);
                    cell.CellStyle = workbook.CreateCellStyle();
                    cell.CellStyle.SetFont(font);
                }



            }


            //(Optional) freeze the header row so it is not scrolled
            sheet.CreateFreezePane(0, 1, 0, 1);

            int rowNumber = 1;

            foreach (T item in items)
            {
                var row = sheet.CreateRow(rowNumber++);

                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    if (FilterColumns != null)
                    {
                        if (!FilterColumns.Contains((Props[i].Name)))
                        {
                            //inserting property values to datatable rows values[i]
                            values[i] = Props[i].GetValue(item, null);
                            row.CreateCell(i).SetCellValue(values[i] == null ? "" : values[i].ToString());
                        }
                    }
                    else
                    {
                        //inserting property values to datatable rows values[i]
                        values[i] = Props[i].GetValue(item, null);
                        row.CreateCell(i).SetCellValue(values[i] == null ? "" : values[i].ToString());
                    }

                }
            }

            //Write the workbook to a memory stream
            MemoryStream output = new MemoryStream();
            workbook.Write(output);
            return output.ToArray();

        }

        #endregion



        #region----------------------------------Sending Mail--------------------------------------


        public static void Mail(string Email, string subject, string Message, string info, string filePath)
        {
            try
            {
                MailMessage mail = new MailMessage();
                SmtpClient emailClient = new SmtpClient();
                if (filePath != "")
                {
                    Attachment attFiles = new Attachment(filePath);
                    mail.Attachments.Add(attFiles);
                }
               // emailClient.Host = "mail.itech-india.com";
                emailClient.Host = "dedrelay.secureserver.net";
                mail.From = new MailAddress("aramechallan@sairamgroup.in");
                mail.Bcc.Add("test@itech-india.com");
                mail.To.Add(Email);
                mail.IsBodyHtml = true;
                mail.Subject = subject;
                mail.Body = Message + info + "<br/><br/>Thanks,<br/><b>ARAM FOUNDATIONS</b><br/>";
                emailClient.Send(mail);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        #endregion

        
    }
}