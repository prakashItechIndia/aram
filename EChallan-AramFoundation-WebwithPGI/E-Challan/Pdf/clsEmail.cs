using System;
using System.Web;
using System.Net.Mail;
using System.IO;

namespace StudentPortal.Pdf
{
    public class clsEmail
    {
        public void sendMail(string strToAddr, string strOrderID, byte[] bytArray, string strFileName, string strName, string strContent, string strTestName )
        {

            String strToAddress = strToAddr;
            String strFromAddress = "donotreply@itech-india.com";
            string strSubject = "Bodhi Psychometric testing - Login ID generation for " + " - " + strOrderID;

            MailMessage message = new MailMessage(strFromAddress, strToAddress, strSubject, strContent);

            if (bytArray != null)
            {
                MemoryStream strmAttachment = new MemoryStream(bytArray);
                Attachment attFiles = new Attachment(strmAttachment, strFileName);
                message.Attachments.Add(attFiles);
            }
           
                if (strTestName != string.Empty)
                {
                    string path = HttpContext.Current.Server.MapPath("../MAIL_TEST_PROCEDURES" + "/" + strTestName + ".doc");
                    Attachment attFiles2 = new Attachment(path);
                     message.Attachments.Add(attFiles2);
                }
           

            message.Bcc.Add("test@itech-india.com");

            message.IsBodyHtml = true;
            SmtpClient emailClient = new SmtpClient();
            emailClient.Host = "mail.itech-india.com";
            emailClient.Send(message);
        }
        public void sendMailForUnlockID(string strToAddr,string strSubject,string strBody)
        {
            String strToAddress = "saravananiyappan.p@itech-india.com";
            String strFromAddress = "donotreply@itech-india.com";

            MailMessage message = new MailMessage(strFromAddress, strToAddress, strSubject, strBody);      
            message.Bcc.Add("test@itech-india.com");
            message.IsBodyHtml = true;
            SmtpClient emailClient = new SmtpClient();
            emailClient.Host = "mail.itech-india.com";
            emailClient.Send(message);
        }

    }
}
