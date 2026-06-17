/**
 * EncryptedView — recipient-only password-protected email page
 * Reached via /app/encrypted/:key shared in encrypted emails
 * Decrypts body using password derived key
 */
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@ui/ui";
import { decryptWithPassword } from "@ui/crypto";

export default function EncryptedRoute() {
  const { key } = useParams<{ key: string }>();
  const [password, setPassword] = useState("");
  const [body, setBody] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const decrypted = await decryptWithPassword(key ?? "", password);
      setBody(decrypted);
    } catch (err) {
      setError("Wrong password or expired link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="encrypted-view">
      <div className="encrypted-card">
        <h1>Encrypted message</h1>
        {body ? (
          <div className="encrypted-body" dangerouslySetInnerHTML={{ __html: body }} />
        ) : (
          <form onSubmit={handleUnlock}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <Button type="submit" loading={loading}>
              Unlock
            </Button>
            {error && <p className="error">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
