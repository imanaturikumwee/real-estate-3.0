import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory + persistent fallback user store
interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'buyer' | 'tenant' | 'owner' | 'agent' | 'staff';
  passwordHash?: string;
  provider: 'local' | 'google' | 'apple' | 'github' | 'facebook';
  avatar?: string;
  createdAt: string;
}

// Initial demo users
const usersDb = new Map<string, UserRecord>([
  [
    'imanaturikumwee@gmail.com',
    {
      id: 'usr_imana',
      fullName: 'Imana Turikumwe',
      email: 'imanaturikumwee@gmail.com',
      phone: '+250 788 112 233',
      role: 'buyer',
      passwordHash: 'estate2024',
      provider: 'local',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString(),
    },
  ],
  [
    'dany@emma-dany.rw',
    {
      id: 'usr_dany',
      fullName: 'Dany Mugisha',
      email: 'dany@emma-dany.rw',
      phone: '+250 788 123 456',
      role: 'staff',
      passwordHash: 'kigali2024',
      provider: 'local',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCtjmMQOY5sAAxNgQYW5ltoLNUo1kLKAdH1c6IzmD9AwmUbfTRMsN9e_K3Ft0MJTY8nv7PaPxe8ISn0cMPArCETMKbk7kdxSjiWPkeFVE2hAQ_ObZCyfzHuthpgvn5BnbSHTXLdSziG0EtQBiP3C8UMktBKjS7HTmvcziBajKSlA_9eraozrZiTDwCSD76913-r21ISJUQGLm45TbCKUatMhvrRAjHTg3eDWVw-Lyxgzr7ZA0zjy36EQ5xclzAjsdeTXyJ-V01YasjL',
      createdAt: new Date().toISOString(),
    },
  ],
]);

// Active sessions token map
const sessions = new Map<string, string>(); // token -> email

function generateToken(email: string): string {
  const token = 'est_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessions.set(token, email);
  return token;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // -------------------------------------------------------------
  // Backend Auth Endpoints
  // -------------------------------------------------------------

  // 1. Register User
  app.post('/api/auth/register', (req: Request, res: Response) => {
    try {
      const { fullName, email, phone, password, role } = req.body;

      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Full name, email, and password are required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (usersDb.has(normalizedEmail)) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      const validRoles = ['buyer', 'tenant', 'owner', 'agent', 'staff'];
      const userRole = validRoles.includes(role) ? role : 'buyer';

      const newUser: UserRecord = {
        id: 'usr_' + Date.now().toString(36),
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || '+250 788 000 000',
        role: userRole,
        passwordHash: password, // In production, use bcrypt
        provider: 'local',
        createdAt: new Date().toISOString(),
      };

      usersDb.set(normalizedEmail, newUser);
      const token = generateToken(normalizedEmail);

      const { passwordHash, ...safeUser } = newUser;
      return res.status(201).json({
        message: 'Registration successful',
        user: safeUser,
        token,
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      return res.status(500).json({ error: 'Internal server error during registration.' });
    }
  });

  // 2. Sign In User
  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      let user = usersDb.get(normalizedEmail);

      // If user doesn't exist yet, allow quick first-time entry for ease of exploration
      if (!user) {
        // Automatically register standard user if testing
        const defaultRole = normalizedEmail.includes('agent') ? 'agent' : 'buyer';
        user = {
          id: 'usr_' + Date.now().toString(36),
          fullName: normalizedEmail.split('@')[0].replace('.', ' ').toUpperCase(),
          email: normalizedEmail,
          phone: '+250 788 000 000',
          role: defaultRole,
          passwordHash: password,
          provider: 'local',
          createdAt: new Date().toISOString(),
        };
        usersDb.set(normalizedEmail, user);
      } else if (user.passwordHash && user.passwordHash !== password) {
        return res.status(401).json({ error: 'Invalid credentials. Please verify your password.' });
      }

      const token = generateToken(normalizedEmail);
      const { passwordHash, ...safeUser } = user;

      return res.json({
        message: 'Sign in successful',
        user: safeUser,
        token,
      });
    } catch (err: any) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Internal server error during sign in.' });
    }
  });

  // 3. Current User Session Check
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ user: null });
    }

    const token = authHeader.split(' ')[1];
    const email = sessions.get(token);
    if (!email || !usersDb.has(email)) {
      return res.status(401).json({ user: null });
    }

    const user = usersDb.get(email)!;
    const { passwordHash, ...safeUser } = user;
    return res.json({ user: safeUser });
  });

  // 4. Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      sessions.delete(token);
    }
    return res.json({ message: 'Logged out successfully' });
  });

  // 5. Social Auth URL generator (Google, Apple, GitHub, Facebook)
  app.get('/api/auth/:provider/url', (req: Request, res: Response) => {
    const { provider } = req.params;
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/${provider}/callback`;

    // Standard provider endpoints or in-app dialog fallback
    const config: Record<string, { authUrl: string; clientId: string }> = {
      google: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        clientId: process.env.GOOGLE_CLIENT_ID || 'emma-dany-google-oauth-client',
      },
      apple: {
        authUrl: 'https://appleid.apple.com/auth/authorize',
        clientId: process.env.APPLE_CLIENT_ID || 'rw.emma-dany.estate.client',
      },
      github: {
        authUrl: 'https://github.com/login/oauth/authorize',
        clientId: process.env.GITHUB_CLIENT_ID || 'emma-dany-github-oauth',
      },
      facebook: {
        authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
        clientId: process.env.FACEBOOK_CLIENT_ID || 'emma-dany-fb-client',
      },
    };

    const providerConfig = config[provider.toLowerCase()];
    if (!providerConfig) {
      return res.status(400).json({ error: `Unsupported auth provider: ${provider}` });
    }

    res.json({
      provider,
      clientId: providerConfig.clientId,
      redirectUri,
      url: `${providerConfig.authUrl}?client_id=${providerConfig.clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code`,
    });
  });

  // 6. Social Auth Callback (HTML postMessage payload for popup)
  app.get('/api/auth/:provider/callback', (req: Request, res: Response) => {
    const { provider } = req.params;
    const code = req.query.code || 'demo_auth_code_' + Date.now();

    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>${provider} Authentication</title></head>
        <body style="font-family: sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; background:#f8f9fa;">
          <div style="text-align:center;">
            <h3>Verifying ${provider.toUpperCase()} Credentials...</h3>
            <p>Please wait, redirecting to The Digital Estate...</p>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'OAUTH_AUTH_SUCCESS',
                provider: '${provider}',
                code: '${code}'
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `);
  });

  // 7. Social Login Direct Execution (Google, Apple, GitHub, Facebook)
  app.post('/api/auth/social-login', (req: Request, res: Response) => {
    try {
      const { provider, email, fullName, avatar, role } = req.body;

      if (!provider || !email) {
        return res.status(400).json({ error: 'Provider and email are required for social authentication.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      let user = usersDb.get(normalizedEmail);

      if (!user) {
        user = {
          id: `usr_${provider}_` + Date.now().toString(36),
          fullName: fullName?.trim() || `${provider.toUpperCase()} Patron`,
          email: normalizedEmail,
          phone: '+250 788 ' + Math.floor(100000 + Math.random() * 900000),
          role: role || 'buyer',
          provider: provider as any,
          avatar:
            avatar ||
            (provider === 'google'
              ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
              : provider === 'apple'
              ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
              : provider === 'github'
              ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
              : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'),
          createdAt: new Date().toISOString(),
        };
        usersDb.set(normalizedEmail, user);
      }

      const token = generateToken(normalizedEmail);
      const { passwordHash, ...safeUser } = user;

      return res.json({
        message: `Authenticated via ${provider}`,
        user: safeUser,
        token,
      });
    } catch (err: any) {
      console.error('Social login error:', err);
      return res.status(500).json({ error: 'Error processing social login.' });
    }
  });

  // 8. Forgot Password
  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    return res.json({
      message: `Password reset instructions have been dispatched to ${email || 'your address'}.`,
    });
  });

  // -------------------------------------------------------------
  // Property & Portfolio Management Endpoints
  // -------------------------------------------------------------

  // Favorites store
  const savedFavorites = new Set<string>(['horizon-residence', 'kivubelt-terraces']);

  // Custom listed properties
  const customProperties: any[] = [];

  // Get all properties with optional search/filter
  app.get('/api/properties', (req: Request, res: Response) => {
    const { query, filter } = req.query;
    res.json({
      success: true,
      favorites: Array.from(savedFavorites),
      customProperties,
    });
  });

  // Add a newly listed property
  app.post('/api/properties', (req: Request, res: Response) => {
    try {
      const {
        title,
        neighborhood,
        price,
        priceDisplay,
        rwfPriceDisplay,
        propertyType,
        beds,
        baths,
        areaM2,
        image,
        description,
      } = req.body;

      if (!title || !neighborhood) {
        return res.status(400).json({ error: 'Title and neighborhood are required.' });
      }

      const newEstate = {
        id: 'estate_' + Date.now().toString(36),
        title: title.trim(),
        neighborhood: neighborhood.trim(),
        location: `${neighborhood.trim()}, Kigali`,
        price: Number(price) || 500000,
        priceDisplay: priceDisplay || `$${Number(price || 500000).toLocaleString()}`,
        rwfPriceDisplay: rwfPriceDisplay || `${Math.round((Number(price) || 500000) / 18000)}M RWF`,
        propertyType: propertyType || 'Villa',
        beds: Number(beds) || 3,
        baths: Number(baths) || 2,
        sqft: (Number(areaM2) || 250) * 10.76,
        areaM2: Number(areaM2) || 250,
        rating: 9.0,
        badge: 'Newly Listed',
        image:
          image ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD5Sf302m49Cgl-HKJ79zbgX_vYXr14YiY-2H3w1VccGCbknMc7gsPFVsvebvnaikmFIG90qJYlxf5cweT_l07hr1Ks94IrIQDYBSVfly_gNdV5KkXfm8s6U0r9VUx5kNCOqfIkPuwwCCctJqszViRLSBD-TqllsHp4q-8YjDHRVnAJl-fbU9obyTN9vslCKCvAy5sDSQOoAYZ4tcgi7C5EQoHF6dHHUSCCfGb2ImYaiwBT0Jjq1dEHcc9D628oT78YCPzen7-Yaq',
        gallery: [image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD5Sf302m49Cgl-HKJ79zbgX_vYXr14YiY-2H3w1VccGCbknMc7gsPFVsvebvnaikmFIG90qJYlxf5cweT_l07hr1Ks94IrIQDYBSVfly_gNdV5KkXfm8s6U0r9VUx5kNCOqfIkPuwwCCctJqszViRLSBD-TqllsHp4q-8YjDHRVnAJl-fbU9obyTN9vslCKCvAy5sDSQOoAYZ4tcgi7C5EQoHF6dHHUSCCfGb2ImYaiwBT0Jjq1dEHcc9D628oT78YCPzen7-Yaq'],
        architecturalStyle: 'Modern Contemporary Kigali Living',
        description: description || 'Prime architectural residence listed on The Digital Estate platform.',
        highlights: ['Verified land registry status', 'Prime Kigali road access', 'High residential yield area'],
        zoning: 'R1A - Low Density Prime Residential',
        estimatedRentalYield: '10.0% p.a.',
        yearBuilt: 2024,
        parkingSpaces: 2,
        lotSize: '800 sqm',
        mapPin: { top: `${35 + Math.floor(Math.random() * 25)}%`, left: `${40 + Math.floor(Math.random() * 25)}%`, label: rwfPriceDisplay?.split(' ')[0] || '40M' },
        transitInfo: {
          destination: 'Kigali City Center',
          walkingMins: 15,
          drivingMins: 5,
        },
        createdAt: new Date().toISOString(),
      };

      customProperties.unshift(newEstate);
      return res.status(201).json({ success: true, estate: newEstate });
    } catch (e: any) {
      console.error('List property error:', e);
      return res.status(500).json({ error: 'Failed to list property.' });
    }
  });

  // Toggle favorite property
  app.post('/api/properties/:id/favorite', (req: Request, res: Response) => {
    const { id } = req.params;
    let isFav = false;
    if (savedFavorites.has(id)) {
      savedFavorites.delete(id);
      isFav = false;
    } else {
      savedFavorites.add(id);
      isFav = true;
    }
    res.json({ success: true, id, isFavorite: isFav, totalFavorites: savedFavorites.size });
  });

  // Portfolio statistics
  app.get('/api/portfolio', (_req: Request, res: Response) => {
    res.json({
      portfolioValueRwf: '142M RWF',
      portfolioValueUsd: '$1,890,000',
      totalHoldings: 3,
      grossYield: '10.8%',
      monthlyIncome: '12.4M RWF',
      occupancyRate: '98%',
    });
  });

  // -------------------------------------------------------------
  // Vite Integration
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Emma & Dany Luxury Realty] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
