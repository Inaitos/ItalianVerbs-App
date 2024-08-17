namespace Verbs.Data;

public interface IVerbsRepository
{
    string[] GetWords();
    public bool TryGetWordDef(string word, out Definition def);
    public bool TryGetConjugation(string word, string group, out Conjugation[] con);
    public string[] GetRand(int top, int count);
    public int GetLength();
    public string[] GetGroups();
}