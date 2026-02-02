using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace StudentPortal.Pdf
{  
        class LengthFixingStream : MemoryStream // feel free to suggest better name than LengthFixingStream
        {
            private long m_length;

            protected override void Dispose(bool disposing)
            {
                m_length = Length;
                base.Dispose(disposing);
            }

            public override byte[] GetBuffer()
            {
                byte[] buffer = base.GetBuffer();
                Array.Resize<byte>(ref buffer, (int)ContentLength); // dirty, but my documents are < 2GB long
                return buffer;
            }

            public long ContentLength
            {
                get { return m_length; }
            }
        }
    }


