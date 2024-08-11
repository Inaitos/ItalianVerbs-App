namespace Verbs.Data;

public class DtoConjugation
{
    public string ShortValue { get; set; }
    public string LongValue { get; set; }

    public DtoConjugation(string v)
    {
        ShortValue = v.Split(',')[0];
        LongValue = v;
    }
}