namespace Verbs.Data;

public class Definition
{
    public Conjugation[] Conjugations { get; set; }
    public string[] Definitions { get; set; }
    public string Word { get; set; }
    public string Url { get; set; }
}

public class Conjugation
{
    public string Form { get; set; }
    public string Group { get; set; }
    public string Value { get; set; }
}