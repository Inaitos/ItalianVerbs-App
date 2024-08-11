namespace Verbs.Data;

public class DtoConjugation
{
    public string Form { get; set; }
    public string ShortValue { get; set; }
    public string LongValue { get; set; }

    public DtoConjugation(string form, string v)
    {
        Form = form;
        ShortValue = v.Split(',')[0];
        LongValue = v;
    }
}