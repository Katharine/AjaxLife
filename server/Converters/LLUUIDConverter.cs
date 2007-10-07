using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace AjaxLife.Converters
{
    class LLUUIDConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value)
        {
            base.WriteJson(writer, ((libsecondlife.LLUUID)value).ToStringHyphenated());
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(libsecondlife.LLUUID).IsAssignableFrom(objectType);
        }
    }
}
