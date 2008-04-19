#region License
/* Copyright (c) 2007, Katharine Berry
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Katharine Berry nor the names of any contributors
 *       may be used to endorse or promote products derived from this software
 *       without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY KATHARINE BERRY ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL KATHARINE BERRY BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/
#endregion
using System;
using System.Collections.Generic;
using System.Text;
using System.Security.Cryptography;
using System.IO;

namespace AjaxLife
{
    class RSACrypto
    {
        private RSACryptoServiceProvider _sp;

        public RSAParameters ExportParameters(bool includePrivateParameters)
        {
            return _sp.ExportParameters(includePrivateParameters);
        }

        // Use 1,024 bit encryption by default.
        public void InitCrypto()
        {
            InitCrypto(1024);
        }

        public void InitCrypto(int bits)
        {
            _sp = new RSACryptoServiceProvider(bits);
        }

        // Take ASCII text and return an encrypted array of bytes.
        // We use System.Text.ASCIIEncoding to convert the string into an array of bytes.
        public byte[] Encrypt(string txt)
        {
            return _sp.Encrypt((new ASCIIEncoding()).GetBytes(txt), false);
        }

        // Return decrypted ASCII bytes. Use ASCIIBytesToString to get something
        // useful out of this.
        public byte[] Decrypt(byte[] txt)
        {
            return _sp.Decrypt(txt, false);
        }

        // Generate a random number based on the current millisecond, then feed into
        // the hash string computer, along with the private key (d) from the RSA
        // algorithm.
        public static string CreateChallengeString(RSAParameters param)
        {
            System.Random rng = new Random(DateTime.Now.Millisecond);

            // Create random string
            byte[] salt = new byte[64];
            for (int i = 0; i < 64; )
            {
                // "Clever" way of avoiding ugly loops. Adds upper and lowercase random letters alternately.
                salt[i++] = (byte)rng.Next(65, 90); // a-z
                salt[i++] = (byte)rng.Next(97, 122); // A-Z
            }

            string challenge = ComputeHashString(salt, param.D);

            return challenge;
        }

        // Merge the two arrays of bytes and return the Base64 string representing the
        // SHA1 hash of the result.
        private static string ComputeHashString(byte[] salt, byte[] uniqueKey)
        {
            // Concat before hashing
            byte[] target = new byte[salt.Length + uniqueKey.Length];
            System.Buffer.BlockCopy(salt, 0, target, 0, salt.Length);
            System.Buffer.BlockCopy(uniqueKey, 0, target, salt.Length, uniqueKey.Length);

            SHA1Managed sha = new SHA1Managed();
            return StringHelper.ToBase64(sha.ComputeHash(target));
        }
    }

    class StringHelper
    {
        // Convert hex into bytes. One hex character = 4 bits, so you can get two hex characters
        // into one byte. As such, an array of bytes of size half the length of the string.
        // We then just use the standard System.byte.Parse method to parse each pair of letters.
        public static byte[] HexStringToBytes(string hex)
        {
            if (hex.Length == 0)
            {
                return new byte[] { 0 };
            }

            if (hex.Length % 2 == 1)
            {
                hex = "0" + hex;
            }

            byte[] result = new byte[hex.Length / 2];

            for (int i = 0; i < hex.Length / 2; i++)
            {
                result[i] = byte.Parse(hex.Substring(2 * i, 2), System.Globalization.NumberStyles.AllowHexSpecifier);
            }

            return result;
        }
        
        //  Loops through the array of bytes, using String.Format to make them into hex.
        public static string BytesToHexString(byte[] input)
        {
            StringBuilder hexString = new StringBuilder(64);

            for (int i = 0; i < input.Length; i++)
            {
                hexString.Append(String.Format("{0:X2}", input[i]));
            }
            return hexString.ToString();
        }

        // Same as above, but specifying base 10 instead of base 2.
        public static string BytesToDecString(byte[] input)
        {
            StringBuilder decString = new StringBuilder(64);

            for (int i = 0; i < input.Length; i++)
            {
                decString.Append(String.Format(i == 0 ? "{0:D3}" : "-{0:D3}", input[i]));
            }
            return decString.ToString();
        }

        // Quick and easy byte/string conversion.
        public static string ASCIIBytesToString(byte[] input)
        {
            return (new ASCIIEncoding()).GetString(input);
        }
        
        public static string UTF16BytesToString(byte[] input)
        {
            return (new UnicodeEncoding()).GetString(input);
        }
        
        public static string UTF8BytesToString(byte[] input)
        {
            return (new UTF8Encoding()).GetString(input);
        }

        // I think these really speak for themselves.
        public static string ToBase64(byte[] input)
        {
            return Convert.ToBase64String(input);
        }

        public static byte[] FromBase64(string base64)
        {
            return Convert.FromBase64String(base64);
        }
    }
}
