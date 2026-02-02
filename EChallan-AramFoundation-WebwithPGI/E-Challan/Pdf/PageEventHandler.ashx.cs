using System;
using System.Collections;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Xml.Linq;

using iTextSharp.text.pdf;
using iTextSharp.text;
using StudentPortal.Pdf;

namespace StudentPortal.Pdf
{
    public class TwoColumnHeaderFooter : PdfPageEventHelper
    {
        // This is the contentbyte object of the writer
        PdfContentByte cb;

        // we will put the final number of pages in a template
        PdfTemplate template;

        // this is the BaseFont we are going to use for the header / footer
        BaseFont bf = null;

        // This keeps track of the creation time
        DateTime PrintTime = DateTime.Now;

        #region Properties
        private string _Title;
        public string Title
        {
            get { return _Title; }
            set { _Title = value; }
        }

        private string _HeaderLeft;
        public string HeaderLeft
        {
            get { return _HeaderLeft; }
            set { _HeaderLeft = value; }
        }

        private string _HeaderRight;
        public string HeaderRight
        {
            get { return _HeaderRight; }
            set { _HeaderRight = value; }
        }

        private Font _HeaderFont;
        public Font HeaderFont
        {
            get { return _HeaderFont; }
            set { _HeaderFont = value; }
        }

        private Font _FooterFont;
        public Font FooterFont
        {
            get { return _FooterFont; }
            set { _FooterFont = value; }
        }
        #endregion

        // we override the onOpenDocument method
        public override void OnOpenDocument(PdfWriter writer, Document document)
        {
            try
            {
                PrintTime = DateTime.Now;
                bf = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                cb = writer.DirectContent;
                template = cb.CreateTemplate(50, 50);
            }
            catch (DocumentException de)
            {
            }
            catch (System.IO.IOException ioe)
            {
            }
        }

        public override void OnStartPage(PdfWriter writer, Document doc)
        {
            iTextSharp.text.Image logo = null;
            try
            {
                string strlogoPath = "/Images/Logo/Logo-sairameduin.gif";

                logo = Image.GetInstance(HttpContext.Current.Server.MapPath("~" + strlogoPath));


               // logo = iTextSharp.text.Image.GetInstance(HttpContext.Current.Server.MapPath("/Images/Logo/Logo-sairameduin.gif"));
                

                //PdfContentByte under = writer.DirectContentUnder;
               // BaseFont baseFont = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.EMBEDDED);

                logo.SetAbsolutePosition(250f, 350f);
                doc.Add(logo);

              //  under = writer.DirectContent;
                //under.Stroke();


              



            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
            }
        }
        //override the OnStartPage event handler to add our header
        //public override void OnStartPage(PdfWriter writer, Document doc)
        //{
        //    //I use a PdfPtable with 1 column to position my header where I want it
        //    PdfPTable headerTbl = new PdfPTable(1);

        //    //set the width of the table to be the same as the document
        //    headerTbl.TotalWidth = doc.PageSize.Width;

        //    //I use an image logo in the header so I need to get an instance of the image to be able to insert it. I believe this is something you couldn't do with older versions of iTextSharp
        //    string strPath = HttpContext.Current.Server.MapPath("p");

        //    iTextSharp.text.Image logo = null;

        //    if (strPath.Contains("admin"))
        //    {
        //        logo = iTextSharp.text.Image.GetInstance(HttpContext.Current.Server.MapPath("p").Replace("admin\\p", "images\\Bodhi-Logo.jpg"));
        //    }
        //    else
        //    {
        //        logo = iTextSharp.text.Image.GetInstance(HttpContext.Current.Server.MapPath("../images/Bodhi-Logo.jpg"));
        //    }

        //    //I used a large version of the logo to maintain the quality when the size was reduced. I guess you could reduce the size manually and use a smaller version, but I used iTextSharp to reduce the scale. As you can see, I reduced it down to 7% of original size.
        //    logo.ScalePercent(100);

        //    //create instance of a table cell to contain the logo
        //    PdfPCell cell = new PdfPCell(logo);

        //    //align the logo to the right of the cell
        //    cell.HorizontalAlignment = Element.ALIGN_CENTER;

        //    //add a bit of padding to bring it away from the right edge
        //    cell.PaddingRight = 20;

        //    //remove the border
        //    cell.Border = 0;

        //    cell.BorderWidthBottom = 0.5f;

        //    cell.PaddingBottom = 12;

        //    //Add the cell to the table
        //    headerTbl.AddCell(cell);

        //    //write the rows out to the PDF output stream. I use the height of the document to position the table. Positioning seems quite strange in iTextSharp and caused me the biggest headache.. It almost seems like it starts from the bottom of the page and works up to the top, so you may ned to play around with this.
        //    headerTbl.WriteSelectedRows(0, -1, 0, (doc.PageSize.Height - 10), writer.DirectContent);

        //}

        public override void OnEndPage(PdfWriter writer, Document document)
        {

            base.OnEndPage(writer, document);

            int pageN = writer.PageNumber;
            String text = "Page " + pageN + " of ";
            float len = bf.GetWidthPoint(text, 8);

            Rectangle pageSize = document.PageSize;

            //cb.SetRGBColorFill(199, 70, 59);

            cb.SetRGBColorFill(0, 0, 0);

            cb.BeginText();
            cb.SetFontAndSize(bf, 8);

            cb.SetTextMatrix(pageSize.GetLeft(40), pageSize.GetBottom(30));
            cb.ShowText(text);
            cb.EndText();

            if (ClsCommon.IsLastPage)
            {
                cb.BeginText();
                cb.SetFontAndSize(bf, 8);
                cb.SetTextMatrix(pageSize.GetLeft(50), pageSize.GetBottom(70));
                
                cb.ShowText(ClsCommon.ReportFooterText);


                cb.EndText();

                cb.BeginText();
                cb.SetFontAndSize(bf, 8);
                cb.SetTextMatrix(pageSize.GetLeft(50), pageSize.GetBottom(60));

                cb.ShowText(ClsCommon.ReportFooterSignText);


                cb.EndText();

            }



            cb.AddTemplate(template, pageSize.GetLeft(40) + len, pageSize.GetBottom(30));

            cb.BeginText();
            cb.SetFontAndSize(bf, 8);
            cb.ShowTextAligned(PdfContentByte.ALIGN_RIGHT,
                "Created On " + String.Format("{0:dd/MM/yyyy}", PrintTime),
                pageSize.GetRight(40),
                pageSize.GetBottom(30), 0);
            cb.EndText();

            base.OnEndPage(writer, document);

            var content = writer.DirectContent;
            var pageBorderRect = new Rectangle(document.PageSize);

            pageBorderRect.Left += document.LeftMargin - 15;
            pageBorderRect.Right -= document.RightMargin - 15;
            pageBorderRect.Top -= document.TopMargin - 10;
            //pageBorderRect.Bottom += document.BottomMargin - 10 ;
            pageBorderRect.Bottom += document.BottomMargin - 10;

            content.SetColorStroke(BaseColor.BLACK);

            content.Rectangle(pageBorderRect.Left, pageBorderRect.Bottom, pageBorderRect.Width, pageBorderRect.Height);
            //content.SetLeading(1.0f);
            content.Stroke();

        }

        public override void OnCloseDocument(PdfWriter writer, Document document)
        {
            base.OnCloseDocument(writer, document);
            template.Stroke();
            template.BeginText();
            template.SetFontAndSize(bf, 8);
            template.SetTextMatrix(0, 0);
            template.ShowText("" + (writer.PageNumber - 1));
            template.EndText();
        }
    }    
}
