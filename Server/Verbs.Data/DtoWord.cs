namespace Verbs.Data;

public class DtoWord
{
    public string Word { get; set; }
    public int Rank { get; set; }

    public Dictionary<string, string> Conjugations { get; set; }

    public DtoWord(string w, int r)
    {
        Word = w;
        Rank = r;
        
    }
}

