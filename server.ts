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

  // -------------------------------------------------------------
  // Property & Portfolio Management Endpoints
  // -------------------------------------------------------------

  // Favorites store
  const savedFavorites = new Set<string>(['horizon-residence', 'kivubelt-terraces']);

  // Inquiries store
  interface InquiryRecord {
    id: string;
    propertyId?: string;
    propertyTitle?: string;
    fullName: string;
    email: string;
    phone: string;
    date?: string;
    notes?: string;
    type: string;
    status: 'pending' | 'confirmed';
    createdAt: string;
  }
  const inquiriesDb: InquiryRecord[] = [
    {
      id: 'inq_demo_01',
      propertyId: 'horizon-residence',
      propertyTitle: 'The Horizon Residence',
      fullName: 'Imana Turikumwe',
      email: 'imanaturikumwee@gmail.com',
      phone: '+250 788 112 233',
      date: '2026-10-15',
      notes: 'Interested in private sunset viewing and title inspection.',
      type: 'Private VIP Tour',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    },
  ];

  // Curated base properties
  const baseProperties = [
    {
      id: 'horizon-residence',
      title: 'The Horizon Residence',
      neighborhood: 'Nyarutarama',
      location: 'Nyarutarama, Kigali',
      price: 850000,
      priceDisplay: '$850,000',
      rwfPriceDisplay: '45M RWF',
      propertyType: 'Villa',
      beds: 4,
      baths: 3,
      sqft: 3450,
      areaM2: 320,
      rating: 9.2,
      badge: 'Premium',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD5Sf302m49Cgl-HKJ79zbgX_vYXr14YiY-2H3w1VccGCbknMc7gsPFVsvebvnaikmFIG90qJYlxf5cweT_l07hr1Ks94IrIQDYBSVfly_gNdV5KkXfm8s6U0r9VUx5kNCOqfIkPuwwCCctJqszViRLSBD-TqllsHp4q-8YjDHRVnAJl-fbU9obyTN9vslCKCvAy5sDSQOoAYZ4tcgi7C5EQoHF6dHHUSCCfGb2ImYaiwBT0Jjq1dEHcc9D628oT78YCPzen7-Yaq',
      architecturalStyle: 'Contemporary Scandinavian-Rwandan Villa',
      description:
        'Masterfully positioned in prime Nyarutarama overlooking Kigali Golf Club. Features triple-pane floor-to-ceiling glass facades, custom hardwood louvers, heated pool, and private landscaped courtyard.',
      highlights: [
        'Walking distance to Kigali Golf Club and diplomatic residences',
        'Solar-integrated backup with dual Tesla powerwalls',
        'Italian porcelain tiles & Musanze volcanic stone cladding',
        '24/7 security patrol with smart biometric entry',
      ],
      zoning: 'R1A - Low Density Prime Residential',
      estimatedRentalYield: '10.2% annual yield (4.2M RWF/mo)',
      yearBuilt: 2024,
      parkingSpaces: 4,
      lotSize: '1,200 sqm',
      mapPin: { top: '38%', left: '42%', label: '45M', coordinates: { lat: -1.936, lng: 30.103 } },
      transitInfo: {
        destination: 'Nyarutarama Business Hub',
        walkingMins: 12,
        drivingMins: 4,
      },
    },
    {
      id: 'kivubelt-terraces',
      title: 'Kivubelt Terraces',
      neighborhood: 'Kibagabaga',
      location: 'Kibagabaga, Kigali',
      price: 620000,
      priceDisplay: '$620,000',
      rwfPriceDisplay: '32M RWF',
      propertyType: 'Duplex',
      beds: 3,
      baths: 2,
      sqft: 2260,
      areaM2: 210,
      rating: 8.8,
      badge: 'New Build',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA3c7xi4yWp-mUwDymmU9GsMcopSAfVtpXn2GdlW9qSNfVOwCN_J0CSzti3O2MVU8_1YQIzGG4_Ppuw8BZ9ncyUv9c_4ui885INoTF_1unkGcidonAAarpRbx9akUp2fSt-G7UBJNnjg95XVkRyoB3U7ObNOZk08c1lxAmm6k1DbtlpZUzFjrqX9enYM-X_XpDYTroRUWj0hkCubWyaLt3dwECeyn6Qkc11Ub8Z6yL1WllnO2yhZ7wwaZXiNLqA6bLObjGstvrGEXk2',
      architecturalStyle: 'Modern Terraced Hillside Townhome',
      description:
        'Perched on the rising ridgeline of Kibagabaga with panoramic views of the Kimironko valley. Open-concept double-height living room with private garden terrace and rooftop sunset pavilion.',
      highlights: [
        'Expansive rooftop entertainment deck with city lights panorama',
        'Ultra-efficient passive ventilation design',
        'Dedicated domestic staff quarters and covered carport',
        'High rental yield with international tech professionals',
      ],
      zoning: 'R2 - Medium Density Planned Community',
      estimatedRentalYield: '11.5% annual yield (3.1M RWF/mo)',
      yearBuilt: 2024,
      parkingSpaces: 2,
      lotSize: '650 sqm',
      mapPin: { top: '48%', left: '68%', label: '32M', coordinates: { lat: -1.944, lng: 30.125 } },
      transitInfo: {
        destination: 'Kigali Convention Centre',
        walkingMins: 22,
        drivingMins: 7,
      },
    },
    {
      id: 'nyarutarama-heights',
      title: 'Nyarutarama Heights',
      neighborhood: 'Nyarutarama',
      location: 'Nyarutarama, Kigali',
      price: 850000,
      priceDisplay: '$850,000',
      rwfPriceDisplay: '52M RWF',
      propertyType: 'Villa',
      beds: 5,
      baths: 4,
      sqft: 4200,
      areaM2: 390,
      rating: 9.6,
      badge: 'Premium Listing',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCUOhQL5jMcnbiwfsVMXu8wIJrtacsGdJmCc1cVFy-nc_HWacnpWp2iUct98HbBPMxx8L1q4FMktUDRKj-xLjvUUWWthqFE01CvpXMaLykGys6PXkk3HF7YtjM4Xp3GLOqJ0DWMvIMEfpsSOu0KunGp2lFZNnBY2hkLxxD67Q-S9__t5UCr3vnDLpVSt-8X9oq4UJvHy92eSyWm_NaDWL0oJsabAD117CG7-UQEZY4ouFRHLOGZh0WUaKHDyiVviz-lH40WEzrBIl4H',
      architecturalStyle: 'Modern Minimalist Villa with Infinity Pool',
      description:
        'Perched prominently in diplomatic Nyarutarama, this modernist residence combines expansive glass curtain walls with local Musanze volcanic basalt detailing.',
      highlights: [
        'Direct panoramic vistas of Kigali Golf Course',
        'Heated infinity pool with cantilevered sun deck',
        'Smart home automation and integrated greywater filtration',
      ],
      zoning: 'R1A - Low Density Prime Residential',
      estimatedRentalYield: '9.8% gross annual yield ($7,000/mo)',
      yearBuilt: 2024,
      parkingSpaces: 4,
      lotSize: '1,450 sqm',
      mapPin: { top: '34%', left: '46%', label: '52M', coordinates: { lat: -1.932, lng: 30.108 } },
      transitInfo: {
        destination: 'Kigali Golf Club',
        walkingMins: 5,
        drivingMins: 2,
      },
    },
    {
      id: 'vision-city-duplex',
      title: 'Vision City Duplex',
      neighborhood: 'Gacuhiro',
      location: 'Gacuhiro, Rwanda',
      price: 425000,
      priceDisplay: '$425,000',
      rwfPriceDisplay: '28M RWF',
      propertyType: 'Duplex',
      beds: 3,
      baths: 3,
      sqft: 2800,
      areaM2: 260,
      rating: 8.9,
      badge: 'Popular',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCFkv3aTYakD1H_X4UZmHAQ5ymG4msN8PxppnuxoNIyM3Iq8YJizoq9rSlR2zjlhTaYG9uHx-1qsuWLxwKSkI5e5TCsvPC2Kyj_3vYDvJaaTCzmHMai8RP6iBQqrnPVZF5CwVYychiNEUsyu4kduW_zRpk7KtOY6_-d0TLSnBAS3JyGoq-cYsRUvvNRY3ckapXE8R7RdcSvG2ZOQ90NmEjUkBY7JSnaxbMyx35BLy04aRqGzQZwAXGmwaQgFJ8cskamSxlY2C1t4ld3',
      architecturalStyle: 'Contemporary Geometric Terraces',
      description:
        'Engineered for flexible modern living within the gated enclave of Vision City in Gacuhiro. Multi-level terraced layout with bespoke European cabinetry.',
      highlights: [
        'Pristine community infrastructure with underground utility lines',
        'Fiber-optic connectivity and backup solar inverter',
      ],
      zoning: 'R2 - Medium Density Planned Community',
      estimatedRentalYield: '10.5% gross annual yield ($3,800/mo)',
      yearBuilt: 2023,
      parkingSpaces: 2,
      lotSize: '620 sqm',
      mapPin: { top: '25%', left: '60%', label: '28M', coordinates: { lat: -1.921, lng: 30.119 } },
      transitInfo: {
        destination: 'Vision City Hub',
        walkingMins: 8,
        drivingMins: 3,
      },
    },
    {
      id: 'hilltop-retreat',
      title: 'Hilltop Retreat',
      neighborhood: 'Rebero',
      location: 'Rebero, Rwanda',
      price: 1200000,
      priceDisplay: '$1,200,000',
      rwfPriceDisplay: '68M RWF',
      propertyType: 'Architectural Estate',
      beds: 6,
      baths: 5,
      sqft: 6500,
      areaM2: 600,
      rating: 9.8,
      badge: 'Exclusive',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDWkgzghzdmuld-W3wMbZ_o3gMjuSVvKU_KDM1BetkI5EiSEn9m-ZIn8m5c_cdDlT72YYrWmdnqZ-1kw9fFqimJEHeAwXyzHxwGkoHrdJ7V_GI4WBD6EXQedHE8qtdoXzjysdXg7kFbINO4ori8TOxHsvXitR1uR9X0huLLDH1nJFTkv5j2iDovGKnb4yxoO99CSrWrHb5NQYlzrQWjNJjpAzbhTy_7OEvvzDqJ-VfQjI4wLEQM1Uk--sdR5dJmRvMBpQePPjcqLskJ',
      architecturalStyle: 'Earthy Hillside Pavilion & Sustainable Timber',
      description:
        'Dominating the summit of Rebero hill with 360-degree vistas across the thousand hills and Kigali downtown skyline.',
      highlights: [
        '360° unobstructed city and rolling mountain panorama',
        'Wine cellar carved into natural basalt bedrock',
        'Infinity edge ozone-treated pool',
      ],
      zoning: 'R1 - Hilltop Low Density Conservation',
      estimatedRentalYield: '8.9% gross annual yield ($9,200/mo)',
      yearBuilt: 2024,
      parkingSpaces: 6,
      lotSize: '2,800 sqm',
      mapPin: { top: '65%', left: '35%', label: '68M', coordinates: { lat: -1.982, lng: 30.082 } },
      transitInfo: {
        destination: 'Kigali Financial District',
        walkingMins: 35,
        drivingMins: 11,
      },
    },
    {
      id: 'zen-pavilion',
      title: 'The Zen Pavilion',
      neighborhood: 'Kiyovu',
      location: 'Kiyovu, Rwanda',
      price: 960000,
      priceDisplay: '$960,000',
      rwfPriceDisplay: '58M RWF',
      propertyType: 'Villa',
      beds: 4,
      baths: 4,
      sqft: 4800,
      areaM2: 445,
      rating: 9.7,
      badge: 'Smart Match',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD2EM6jH0Hi1NNiDmQIIP7GwWjjAnOhldBUxbD_AnJYGN7d6tAG_KolV9u8fdOoQWCOklPneDd8SjID4_QjUr3A9gp1tyYCerCF5FRP31JbAXi1mijntzH2Ksv3t0gNhfLi45GWVXE8h_PFfLUGF0eh8teau-IlMEp_KNbWUb5t2ps-PlmrXgHiBKJKSAsJuUFmykwqUxO6Kj_0au1is72yYFknZnP5iOZyE-1ntZvw6JMiAbln8b0o4PYREBf5-zE6aYXV_dt5uSFW',
      architecturalStyle: 'Japanese-Rwandan Wabi-Sabi Fusion',
      description:
        'Located in quiet Old Kiyovu near embassies. Designed around an internal reflecting pool and central courtyard.',
      highlights: [
        'Floor-to-ceiling glass sliding partitions for indoor-outdoor flow',
        'Zero-VOC certified natural clay plaster and volcanic stone tiles',
        'High-security embassy quarter perimeter',
      ],
      zoning: 'R1 - Kiyovu Residential Heritage & Luxury',
      estimatedRentalYield: '9.2% gross annual yield ($7,500/mo)',
      yearBuilt: 2024,
      parkingSpaces: 3,
      lotSize: '1,200 sqm',
      mapPin: { top: '42%', left: '32%', label: '58M', coordinates: { lat: -1.956, lng: 30.064 } },
      transitInfo: {
        destination: 'Downtown Kigali',
        walkingMins: 10,
        drivingMins: 3,
      },
    },
    {
      id: 'sky-terrace-penthouse',
      title: 'Sky Terrace Penthouse',
      neighborhood: 'Kimihurura',
      location: 'Kimihurura, Rwanda',
      price: 680000,
      priceDisplay: '$680,000',
      rwfPriceDisplay: '39M RWF',
      propertyType: 'Penthouse',
      beds: 3,
      baths: 3,
      sqft: 3100,
      areaM2: 290,
      rating: 9.4,
      badge: 'High-Yield Asset',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCq22PAOj0R1YTr1O-EC4p76p4EoOl16sC3OZy5eNz6u_BPqWB-K54BNZ69O156ckYfgx_Ipm0e1eA02CzmbLCOH9YuTgXV0YWtbrmYyVbWAfMz3IRx1eroleA6GRGoVfw8mYM459NW0qwYUJI0Ik6xrUEgI-VsxGrBwiTbLfUT9i8z3bD9wKpagTPuy5ei24wqMsJu9Hn4IWpgRajHR1CBf3tiKjAmRR9HEX5-Fkb1V86S-HmrNiq-oVdJKUt_c5qVRJehfTosdz_H',
      architecturalStyle: 'High-Altitude Urban Modernism',
      description:
        'Hovering over Kimihurura’s culinary and diplomatic corridor with wraparound terrace capturing the illuminated Convention Centre.',
      highlights: [
        'Private rooftop hot tub overlooking the Convention Centre dome',
        'Direct elevator foyer with coded biometric access',
      ],
      zoning: 'C2 - Commercial Mixed Urban Corridor',
      estimatedRentalYield: '11.8% gross annual yield ($6,500/mo)',
      yearBuilt: 2023,
      parkingSpaces: 2,
      lotSize: '310 sqm floorplate',
      mapPin: { top: '55%', left: '55%', label: '39M', coordinates: { lat: -1.954, lng: 30.089 } },
      transitInfo: {
        destination: 'Kigali Convention Centre',
        walkingMins: 7,
        drivingMins: 2,
      },
    },
  ];

  // Custom listed properties store
  const customProperties: any[] = [];

  // Helper to get all combined properties
  function getAllProperties() {
    return [...customProperties, ...baseProperties];
  }

  // 1. Search & Filter Properties with multi-criteria support
  app.get('/api/properties/search', (req: Request, res: Response) => {
    try {
      const {
        q,
        query,
        district,
        type,
        propertyType,
        minPrice,
        maxPrice,
        beds,
        sortBy = 'featured',
      } = req.query;

      const searchTerm = ((q || query || '') as string).trim().toLowerCase();
      const targetDistrict = ((district || '') as string).trim();
      const targetType = ((type || propertyType || '') as string).trim();
      const minP = minPrice ? Number(minPrice) : 0;
      const maxP = maxPrice ? Number(maxPrice) : Infinity;
      const minBeds = beds ? Number(beds) : 0;

      let results = getAllProperties().filter((item) => {
        // District filter
        if (targetDistrict && targetDistrict !== 'All Districts' && targetDistrict !== 'All') {
          if (!item.neighborhood.toLowerCase().includes(targetDistrict.toLowerCase())) {
            return false;
          }
        }

        // Property Type filter
        if (targetType && targetType !== 'All Types' && targetType !== 'All') {
          if (item.propertyType.toLowerCase() !== targetType.toLowerCase()) {
            return false;
          }
        }

        // Price range filter
        if (item.price < minP || item.price > maxP) {
          return false;
        }

        // Bedrooms filter
        if (minBeds > 0 && item.beds < minBeds) {
          return false;
        }

        // Search text
        if (searchTerm) {
          const matchTitle = item.title.toLowerCase().includes(searchTerm);
          const matchNeighborhood = item.neighborhood.toLowerCase().includes(searchTerm);
          const matchStyle = item.architecturalStyle.toLowerCase().includes(searchTerm);
          const matchDesc = item.description.toLowerCase().includes(searchTerm);
          if (!matchTitle && !matchNeighborhood && !matchStyle && !matchDesc) {
            return false;
          }
        }

        return true;
      });

      // Sorting
      results.sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'sqft') return b.sqft - a.sqft;
        if (sortBy === 'yield') {
          const yA = parseFloat(a.estimatedRentalYield) || 0;
          const yB = parseFloat(b.estimatedRentalYield) || 0;
          return yB - yA;
        }
        return (b.rating || 0) - (a.rating || 0);
      });

      // Augment with isFavorite flag
      const enriched = results.map((p) => ({
        ...p,
        isFavorite: savedFavorites.has(p.id),
      }));

      return res.json({
        success: true,
        total: enriched.length,
        properties: enriched,
        favoritesCount: savedFavorites.size,
      });
    } catch (err: any) {
      console.error('Search error:', err);
      return res.status(500).json({ error: 'Search failed' });
    }
  });

  // 2. Map Pins Endpoint (lightweight coordinates for Kigali Map canvas)
  app.get('/api/properties/map-pins', (_req: Request, res: Response) => {
    const pins = getAllProperties().map((p) => ({
      id: p.id,
      title: p.title,
      neighborhood: p.neighborhood,
      price: p.price,
      priceDisplay: p.priceDisplay,
      rwfPriceDisplay: p.rwfPriceDisplay,
      propertyType: p.propertyType,
      image: p.image,
      beds: p.beds,
      baths: p.baths,
      mapPin: p.mapPin,
      isFavorite: savedFavorites.has(p.id),
    }));
    return res.json({ success: true, pins });
  });

  // 3. Saved Favorites
  app.get('/api/properties/saved', (_req: Request, res: Response) => {
    const saved = getAllProperties()
      .filter((p) => savedFavorites.has(p.id))
      .map((p) => ({ ...p, isFavorite: true }));
    return res.json({
      success: true,
      total: saved.length,
      savedIds: Array.from(savedFavorites),
      properties: saved,
    });
  });

  // 4. Single Property Detail
  app.get('/api/properties/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const property = getAllProperties().find((p) => p.id === id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    return res.json({
      success: true,
      property: {
        ...property,
        isFavorite: savedFavorites.has(property.id),
      },
    });
  });

  // 5. Inquiries / VIP Tour Booking
  app.post('/api/inquiries', (req: Request, res: Response) => {
    try {
      const { propertyId, propertyTitle, fullName, email, phone, date, notes, type } = req.body;
      if (!fullName || !email || !phone) {
        return res.status(400).json({ error: 'Full name, email, and phone are required.' });
      }

      const newInquiry: InquiryRecord = {
        id: 'inq_' + Date.now().toString(36),
        propertyId,
        propertyTitle,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        date: date || new Date().toISOString().split('T')[0],
        notes: notes?.trim() || '',
        type: type || 'Private VIP Tour',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      inquiriesDb.unshift(newInquiry);

      return res.status(201).json({
        success: true,
        message: 'Your private VIP tour has been scheduled with Emma & Dany advisors.',
        inquiry: newInquiry,
        confirmationCode: 'RW-VIP-' + Math.floor(1000 + Math.random() * 9000),
      });
    } catch (err: any) {
      console.error('Inquiry error:', err);
      return res.status(500).json({ error: 'Failed to record tour request.' });
    }
  });

  // 6. Get all properties (legacy compatibility)
  app.get('/api/properties', (_req: Request, res: Response) => {
    res.json({
      success: true,
      favorites: Array.from(savedFavorites),
      customProperties,
      total: getAllProperties().length,
    });
  });

  // 7. Add a newly listed property
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
        gallery: [
          image ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD5Sf302m49Cgl-HKJ79zbgX_vYXr14YiY-2H3w1VccGCbknMc7gsPFVsvebvnaikmFIG90qJYlxf5cweT_l07hr1Ks94IrIQDYBSVfly_gNdV5KkXfm8s6U0r9VUx5kNCOqfIkPuwwCCctJqszViRLSBD-TqllsHp4q-8YjDHRVnAJl-fbU9obyTN9vslCKCvAy5sDSQOoAYZ4tcgi7C5EQoHF6dHHUSCCfGb2ImYaiwBT0Jjq1dEHcc9D628oT78YCPzen7-Yaq',
        ],
        architecturalStyle: 'Modern Contemporary Kigali Living',
        description: description || 'Prime architectural residence listed on The Digital Estate platform.',
        highlights: ['Verified land registry status', 'Prime Kigali road access', 'High residential yield area'],
        zoning: 'R1A - Low Density Prime Residential',
        estimatedRentalYield: '10.0% p.a.',
        yearBuilt: 2024,
        parkingSpaces: 2,
        lotSize: '800 sqm',
        mapPin: {
          top: `${35 + Math.floor(Math.random() * 25)}%`,
          left: `${40 + Math.floor(Math.random() * 25)}%`,
          label: rwfPriceDisplay?.split(' ')[0] || '40M',
          coordinates: { lat: -1.945, lng: 30.1 },
        },
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

  // 8. Toggle favorite property
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

  // -------------------------------------------------------------
  // Curated Datasets for Houses, Apartments, Land, and Investments
  // -------------------------------------------------------------

  const housesDataset = [
    {
      id: 'house-obsidian-ridge',
      title: 'The Obsidian Ridge',
      neighborhood: 'Nyarutarama',
      location: 'Nyarutarama, Kigali',
      monthlyRentRwf: 3200000,
      priceDisplay: 'RWF 3.2M',
      beds: 4,
      baths: 3,
      areaM2: 450,
      propertyType: 'Residential Villa',
      category: 'RESIDENTIAL',
      aiScore: 9.8,
      isFeatured: true,
      amenities: ['Private Pool', 'Mountain View', 'Solar Energy', 'High-Speed WiFi'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBuGAIKUQvpl-Hl6r4oC2hhqwm3zmZXDhZCJrPC92MfOKGSmCkDOjOrbMBrXpF6_LEkgc1eYBV-B65sa0VnYpikb7k1MkHkdS7wdOZODq4FRm0e4b3S4OEUy5tg6rT_Sh7oabxkYDL5-kfG6W1A22D_-sg6OveoQ11i0bbonwkElpnd0tvkIGHxeowV5UAGaLg5ohUnDkS89BhmDUdYJLN0rK2BapuHYfM2WeBgYaNHp8X9oB4V9R62gd6Vmp52PZ3U9lbtBIac9_hR',
      coordinates: { lat: -1.9368, lng: 30.0988 },
      mapPinLabel: 'RWF 3.2M',
      description: 'Handcrafted architectural villa featuring Musanze volcanic stone, floor-to-ceiling glass, private heated lap pool, and panoramic views of Kigali Golf Club.',
    },
    {
      id: 'house-emerald-terraces',
      title: 'Emerald Terraces',
      neighborhood: 'Kibagabaga',
      location: 'Kibagabaga, Kigali',
      monthlyRentRwf: 1800000,
      priceDisplay: 'RWF 1.8M',
      beds: 3,
      baths: 2,
      areaM2: 320,
      propertyType: 'Modern Townhouse',
      category: 'PREMIUM',
      aiScore: 9.2,
      amenities: ['Private Pool', 'Solar Energy', 'High-Speed WiFi'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBIoH1CD8fCbIbvUl0dCcjQZgMlhVs3ydWlJEG32UisPFIr5_gW369a0uArsjdyIPEyzZjtT9SGlr7k1jGkXVDHl5mFy3lBW6LDiW1DgvkbzIONHklpO_YN-5_F5gwyJ0GuLHGhMk7JsP84P_vzFvOPC7g6Iz6z9pKeaEMYyfxvpdMSduibpWwR1hBjDUvJlx6egYWmU-YSNNXuJg01ek3JZBUNxaoP3H3shtEVN8Xq8mVd0kVwG7AO8Upm90fRb2z_M2j6UOKL6iye',
      coordinates: { lat: -1.944, lng: 30.125 },
      mapPinLabel: 'RWF 1.8M',
      description: 'Sleek Scandinavian-tropical hybrid residence with open courtyard garden, natural timber louvers, and infinity views overlooking the Kimironko valley.',
    },
    {
      id: 'house-horizon-heights',
      title: 'Horizon Heights',
      neighborhood: 'Rebero',
      location: 'Rebero Hill, Kigali',
      monthlyRentRwf: 4500000,
      priceDisplay: 'RWF 4.5M',
      beds: 5,
      baths: 5,
      areaM2: 680,
      propertyType: 'Estate Mansion',
      category: 'INVESTMENT GRADE',
      aiScore: 9.9,
      isFeatured: true,
      badge: "Editor's Choice",
      amenities: ['Private Pool', 'Mountain View', 'Solar Energy', 'High-Speed WiFi'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDcedMGqJ2ghqMY2ljqkmRN5zTKzA-RDNdSxHfN7AC1S04DYDT-oIxOQ8XwGL11yHjLJ2cY7RcgeK7x0n3_djmJSN8IuZ7uOI-UpkFtiJ956BYnPER2yUEH4aRICejlUcbg4aAk764HzuyVDoXcYWXwY4oulkzTLiL5w6U5vKkjz29Tlahx9wPM_ro42zuSxNAxSp95bO33wT0t1b4Oay0BbYINH9hTixDEiCRxYeuGdDra4yWlW-Gd22vZUMV2zxUmxVTCc23VB5AA',
      coordinates: { lat: -1.982, lng: 30.082 },
      mapPinLabel: 'RWF 4.5M',
      description: 'Experience unparalleled panoramic views of the city. This state-of-the-art smart home features zero-carbon energy systems, a triple-tier security perimeter, and an infinity pool merging with the horizon.',
    },
    {
      id: 'house-kacyiru-embassy-villa',
      title: 'Kacyiru Diplomatic Villa',
      neighborhood: 'Kacyiru',
      location: 'Kacyiru, Kigali',
      monthlyRentRwf: 2800000,
      priceDisplay: 'RWF 2.8M',
      beds: 4,
      baths: 3,
      areaM2: 410,
      propertyType: 'Diplomatic Residence',
      category: 'RESIDENTIAL',
      aiScore: 9.5,
      amenities: ['Private Pool', 'High-Speed WiFi', 'Solar Energy'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCUOhQL5jMcnbiwfsVMXu8wIJrtacsGdJmCc1cVFy-nc_HWacnpWp2iUct98HbBPMxx8L1q4FMktUDRKj-xLjvUUWWthqFE01CvpXMaLykGys6PXkk3HF7YtjM4Xp3GLOqJ0DWMvIMEfpsSOu0KunGp2lFZNnBY2hkLxxD67Q-S9__t5UCr3vnDLpVSt-8X9oq4UJvHy92eSyWm_NaDWL0oJsabAD117CG7-UQEZY4ouFRHLOGZh0WUaKHDyiVviz-lH40WEzrBIl4H',
      coordinates: { lat: -1.943, lng: 30.076 },
      mapPinLabel: 'RWF 2.8M',
      description: 'Nestled in the quiet diplomatic enclave of Kacyiru with manicured private gardens, guardhouse perimeter, and floor-to-ceiling glass interiors.',
    },
    {
      id: 'house-gacuriro-sky-estate',
      title: 'Gacuriro Sky Sanctuary',
      neighborhood: 'Gacuriro',
      location: 'Gacuriro, Kigali',
      monthlyRentRwf: 3600000,
      priceDisplay: 'RWF 3.6M',
      beds: 4,
      baths: 4,
      areaM2: 520,
      propertyType: 'Luxury Contemporary Villa',
      category: 'PREMIUM',
      aiScore: 9.7,
      amenities: ['Private Pool', 'Mountain View', 'Solar Energy', 'High-Speed WiFi'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD5Sf302m49Cgl-HKJ79zbgX_vYXr14YiY-2H3w1VccGCbknMc7gsPFVsvebvnaikmFIG90qJYlxf5cweT_l07hr1Ks94IrIQDYBSVfly_gNdV5KkXfm8s6U0r9VUx5kNCOqfIkPuwwCCctJqszViRLSBD-TqllsHp4q-8YjDHRVnAJl-fbU9obyTN9vslCKCvAy5sDSQOoAYZ4tcgi7C5EQoHF6dHHUSCCfGb2ImYaiwBT0Jjq1dEHcc9D628oT78YCPzen7-Yaq',
      coordinates: { lat: -1.925, lng: 30.108 },
      mapPinLabel: 'RWF 3.6M',
      description: 'High-elevation residence featuring double-height entertainment salons, automated thermal blinds, solar microgrid, and cascading terraces overlooking Gasabo valleys.',
    },
    {
      id: 'house-kiyovu-heritage-manor',
      title: 'Kiyovu Heritage Manor',
      neighborhood: 'Kiyovu',
      location: 'Kiyovu, Kigali',
      monthlyRentRwf: 4200000,
      priceDisplay: 'RWF 4.2M',
      beds: 5,
      baths: 4,
      areaM2: 600,
      propertyType: 'Colonial Heritage Estate',
      category: 'INVESTMENT GRADE',
      aiScore: 9.6,
      badge: 'Heritage Luxury',
      amenities: ['Mountain View', 'Solar Energy', 'High-Speed WiFi'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA3c7xi4yWp-mUwDymmU9GsMcopSAfVtpXn2GdlW9qSNfVOwCN_J0CSzti3O2MVU8_1YQIzGG4_Ppuw8BZ9ncyUv9c_4ui885INoTF_1unkGcidonAAarpRbx9akUp2fSt-G7UBJNnjg95XVkRyoB3U7ObNOZk08c1lxAmm6k1DbtlpZUzFjrqX9enYM-X_XpDYTroRUWj0hkCubWyaLt3dwECeyn6Qkc11Ub8Z6yL1WllnO2yhZ7wwaZXiNLqA6bLObjGstvrGEXk2',
      coordinates: { lat: -1.957, lng: 30.065 },
      mapPinLabel: 'RWF 4.2M',
      description: 'Historic prime Kiyovu manor with modern interior architectural overhaul, century-old jacaranda trees, separate service staff quarters, and diplomatic security clearance.',
    },
  ];

  const housesForSaleDataset = [
    {
      id: 'sale-sovereign-ridge-villa',
      title: 'The Sovereign Ridge Villa',
      neighborhood: 'Nyarutarama',
      location: 'Nyarutarama Ridge, Kigali',
      priceUsd: 950000,
      priceRwf: 1235000000,
      priceDisplayUsd: '$950,000',
      priceDisplayRwf: 'RWF 1.235B',
      beds: 5,
      baths: 5,
      areaM2: 580,
      plotSizeM2: 1400,
      propertyType: 'Diplomatic Villa',
      category: 'FREEHOLD ESTATE',
      aiScore: 9.9,
      badge: 'Prime Acquisition',
      isFeatured: true,
      titleDeedType: 'Clean UPI Freehold Deed',
      projectedAppreciation: '+13.8% YoY',
      projectedYield: '9.6% Net Yield',
      yearBuilt: 2024,
      zoning: 'R1A - Low Density Prime Residential',
      parkingSpaces: 4,
      amenities: ['Private Pool', 'Mountain View', 'Solar Energy', 'High-Speed WiFi', 'Staff Quarters', 'Gated Security'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBuGAIKUQvpl-Hl6r4oC2hhqwm3zmZXDhZCJrPC92MfOKGSmCkDOjOrbMBrXpF6_LEkgc1eYBV-B65sa0VnYpikb7k1MkHkdS7wdOZODq4FRm0e4b3S4OEUy5tg6rT_Sh7oabxkYDL5-kfG6W1A22D_-sg6OveoQ11i0bbonwkElpnd0tvkIGHxeowV5UAGaLg5ohUnDkS89BhmDUdYJLN0rK2BapuHYfM2WeBgYaNHp8X9oB4V9R62gd6Vmp52PZ3U9lbtBIac9_hR',
      coordinates: { lat: -1.9368, lng: 30.0988 },
      mapPinLabel: '$950k',
      description:
        'An architectural masterpiece with panoramic golf course vistas. Built with thermal volcanic stone cladding, cantilevered teak terraces, heated infinity lap pool, automated biometric entry, and full solar storage microgrid.',
    },
    {
      id: 'sale-kiyovu-presidential-manor',
      title: 'Kiyovu Presidential Manor',
      neighborhood: 'Kiyovu',
      location: 'Diplomatic Quarter, Kiyovu, Kigali',
      priceUsd: 1450000,
      priceRwf: 1885000000,
      priceDisplayUsd: '$1,450,000',
      priceDisplayRwf: 'RWF 1.885B',
      beds: 6,
      baths: 6,
      areaM2: 750,
      plotSizeM2: 2200,
      propertyType: 'Colonial Ambassadorial Manor',
      category: 'HERITAGE LUXURY',
      aiScore: 9.9,
      badge: 'Diplomatic Grade',
      isFeatured: true,
      titleDeedType: 'Clean UPI Freehold Deed',
      projectedAppreciation: '+12.4% YoY',
      projectedYield: '8.8% Net Yield',
      yearBuilt: 2023,
      zoning: 'R1A - Ambassadorial Prime',
      parkingSpaces: 6,
      amenities: ['Private Pool', 'Mountain View', 'Solar Energy', 'Staff Quarters', 'Gated Security', 'Tennis Court'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCGGBSEI_gmOrmBmbORG_C2nEM-GUyxCi-132RFPUTpZtPku_la-yK0nuOF1q4xHNRZ7opKZ6qFlATogkeDAXVB1DivZ9rO5F97MTbTfszjYqLyOrCeWuqSDRz1xVYfxWRpMu-q9vADJNCzIr4k4laQlG4sWwsIxODyyu4QPL1PGvu9FtqTMo_0ynyQU9RY816bT2BOPcp_WeBSJ_gVHlju9WifNEQ7PNG7V2BM4UboJfWGs9Q-wSfwzbIpLfOYJT1YfV2cOX8toGPE',
      coordinates: { lat: -1.956, lng: 30.064 },
      mapPinLabel: '$1.45M',
      description:
        'Prestigious embassy-ready estate situated in the heart of Old Kiyovu. Features a private regulation tennis court, mature century-old jacaranda groves, detached guest lodge, guard quarters, and expansive formal reception salon.',
    },
    {
      id: 'sale-rebero-obsidian-horizon',
      title: 'Rebero Obsidian Horizon',
      neighborhood: 'Rebero',
      location: 'Rebero Summit, Kigali',
      priceUsd: 680000,
      priceRwf: 884000000,
      priceDisplayUsd: '$680,000',
      priceDisplayRwf: 'RWF 884M',
      beds: 4,
      baths: 4,
      areaM2: 460,
      plotSizeM2: 950,
      propertyType: 'Contemporary Modern Villa',
      category: 'HILLTOP SANCTUARY',
      aiScore: 9.7,
      badge: "Architect's Choice",
      isFeatured: true,
      titleDeedType: 'Clean UPI Freehold Deed',
      projectedAppreciation: '+15.2% YoY',
      projectedYield: '10.5% Net Yield',
      yearBuilt: 2024,
      zoning: 'R1 - Low Density Residential',
      parkingSpaces: 3,
      amenities: ['Private Pool', 'Mountain View', 'Solar Energy', 'High-Speed WiFi', 'Gated Security'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDcedMGqJ2ghqMY2ljqkmRN5zTKzA-RDNdSxHfN7AC1S04DYDT-oIxOQ8XwGL11yHjLJ2cY7RcgeK7x0n3_djmJSN8IuZ7uOI-UpkFtiJ956BYnPER2yUEH4aRICejlUcbg4aAk764HzuyVDoXcYWXwY4oulkzTLiL5w6U5vKkjz29Tlahx9wPM_ro42zuSxNAxSp95bO33wT0t1b4Oay0BbYINH9hTixDEiCRxYeuGdDra4yWlW-Gd22vZUMV2zxUmxVTCc23VB5AA',
      coordinates: { lat: -1.982, lng: 30.082 },
      mapPinLabel: '$680k',
      description:
        'Suspended over the southwestern ridge of Rebero Hill, this home offers 270-degree sunset vistas of Kigali. Equipped with smart floor warming, frameless sliding glass panels, zero-carbon battery storage, and an infinity pool that merges with the clouds.',
    },
    {
      id: 'sale-kibagabaga-architectural-sanctuary',
      title: 'Kibagabaga Architectural Haven',
      neighborhood: 'Kibagabaga',
      location: 'Kibagabaga Hill, Kigali',
      priceUsd: 480000,
      priceRwf: 624000000,
      priceDisplayUsd: '$480,000',
      priceDisplayRwf: 'RWF 624M',
      beds: 4,
      baths: 3,
      areaM2: 380,
      plotSizeM2: 720,
      propertyType: 'Modern Townhouse Villa',
      category: 'PRIME VALUE',
      aiScore: 9.5,
      badge: 'Verified Title',
      isFeatured: false,
      titleDeedType: 'Instant Notarized Transfer',
      projectedAppreciation: '+11.8% YoY',
      projectedYield: '10.1% Net Yield',
      yearBuilt: 2024,
      zoning: 'R2 - Planned Residential Community',
      parkingSpaces: 3,
      amenities: ['Private Pool', 'Solar Energy', 'High-Speed WiFi', 'Gated Security'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA3c7xi4yWp-mUwDymmU9GsMcopSAfVtpXn2GdlW9qSNfVOwCN_J0CSzti3O2MVU8_1YQIzGG4_Ppuw8BZ9ncyUv9c_4ui885INoTF_1unkGcidonAAarpRbx9akUp2fSt-G7UBJNnjg95XVkRyoB3U7ObNOZk08c1lxAmm6k1DbtlpZUzFjrqX9enYM-X_XpDYTroRUWj0hkCubWyaLt3dwECeyn6Qkc11Ub8Z6yL1WllnO2yhZ7wwaZXiNLqA6bLObjGstvrGEXk2',
      coordinates: { lat: -1.944, lng: 30.125 },
      mapPinLabel: '$480k',
      description:
        'Seamless blend of Scandinavian minimalism and Rwandan artisanal volcanic stone masonry. Offers a private landscaped courtyard, custom eucalyptus cabinetry, solar water heating, and rooftop sunset terrace.',
    },
    {
      id: 'sale-gacuriro-modernist-haven',
      title: 'Gacuriro Modernist Haven',
      neighborhood: 'Gacuriro',
      location: 'Gacuriro, Gasabo, Kigali',
      priceUsd: 590000,
      priceRwf: 767000000,
      priceDisplayUsd: '$590,000',
      priceDisplayRwf: 'RWF 767M',
      beds: 4,
      baths: 4,
      areaM2: 420,
      plotSizeM2: 850,
      propertyType: 'Contemporary Architectural Villa',
      category: 'NEW CONSTRUCTION',
      aiScore: 9.6,
      badge: 'Turnkey Luxury',
      isFeatured: false,
      titleDeedType: 'Clean UPI Freehold Deed',
      projectedAppreciation: '+13.0% YoY',
      projectedYield: '9.8% Net Yield',
      yearBuilt: 2024,
      zoning: 'R1 - Prime Residential',
      parkingSpaces: 4,
      amenities: ['Mountain View', 'Solar Energy', 'High-Speed WiFi', 'Staff Quarters', 'Gated Security'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD5Sf302m49Cgl-HKJ79zbgX_vYXr14YiY-2H3w1VccGCbknMc7gsPFVsvebvnaikmFIG90qJYlxf5cweT_l07hr1Ks94IrIQDYBSVfly_gNdV5KkXfm8s6U0r9VUx5kNCOqfIkPuwwCCctJqszViRLSBD-TqllsHp4q-8YjDHRVnAJl-fbU9obyTN9vslCKCvAy5sDSQOoAYZ4tcgi7C5EQoHF6dHHUSCCfGb2ImYaiwBT0Jjq1dEHcc9D628oT78YCPzen7-Yaq',
      coordinates: { lat: -1.925, lng: 30.108 },
      mapPinLabel: '$590k',
      description:
        'Elevated hillside residence designed for seamless indoor-outdoor living. Features soaring double-height ceilings, automated louvered screens, Italian porcelain tiles, and a private guest pavilion.',
    },
    {
      id: 'sale-kacyiru-diplomatic-enclave',
      title: 'Kacyiru Diplomatic Enclave Villa',
      neighborhood: 'Kacyiru',
      location: 'Ministries & Embassy Row, Kacyiru, Kigali',
      priceUsd: 820000,
      priceRwf: 1066000000,
      priceDisplayUsd: '$820,000',
      priceDisplayRwf: 'RWF 1.066B',
      beds: 5,
      baths: 4,
      areaM2: 510,
      plotSizeM2: 1100,
      propertyType: 'Diplomatic Residence',
      category: 'SECURE ENCLAVE',
      aiScore: 9.8,
      badge: 'High Security',
      isFeatured: false,
      titleDeedType: 'Clean UPI Freehold Deed',
      projectedAppreciation: '+12.1% YoY',
      projectedYield: '9.2% Net Yield',
      yearBuilt: 2023,
      zoning: 'R1A - Diplomatic Residential',
      parkingSpaces: 4,
      amenities: ['Private Pool', 'Solar Energy', 'High-Speed WiFi', 'Staff Quarters', 'Gated Security'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCUOhQL5jMcnbiwfsVMXu8wIJrtacsGdJmCc1cVFy-nc_HWacnpWp2iUct98HbBPMxx8L1q4FMktUDRKj-xLjvUUWWthqFE01CvpXMaLykGys6PXkk3HF7YtjM4Xp3GLOqJ0DWMvIMEfpsSOu0KunGp2lFZNnBY2hkLxxD67Q-S9__t5UCr3vnDLpVSt-8X9oq4UJvHy92eSyWm_NaDWL0oJsabAD117CG7-UQEZY4ouFRHLOGZh0WUaKHDyiVviz-lH40WEzrBIl4H',
      coordinates: { lat: -1.943, lng: 30.076 },
      mapPinLabel: '$820k',
      description:
        'Located steps from major international embassies in Kacyiru. Impeccable high-perimeter security, guard post, multi-vehicle carport, manicured tropical lawn, and dedicated chef kitchen with domestic staff suites.',
    },
    {
      id: 'sale-kimihurura-summit-villa',
      title: 'Kimihurura Summit Villa',
      neighborhood: 'Kimihurura',
      location: 'Kimihurura Hill, Gasabo, Kigali',
      priceUsd: 750000,
      priceRwf: 975000000,
      priceDisplayUsd: '$750,000',
      priceDisplayRwf: 'RWF 975M',
      beds: 4,
      baths: 4,
      areaM2: 490,
      plotSizeM2: 1000,
      propertyType: 'Hillside Modern Estate',
      category: 'CULINARY & CULTURAL HUB',
      aiScore: 9.7,
      badge: 'City Views',
      isFeatured: false,
      titleDeedType: 'Clean UPI Freehold Deed',
      projectedAppreciation: '+14.5% YoY',
      projectedYield: '10.2% Net Yield',
      yearBuilt: 2024,
      zoning: 'R1 - Prime Residential',
      parkingSpaces: 4,
      amenities: ['Private Pool', 'Mountain View', 'Solar Energy', 'High-Speed WiFi', 'Gated Security'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDcrj7BhiOC43OIwgUjrbO98kUY71phal0YovGq7UA3RLC0MNY7wgNngsUXucPDIWb0eYnp96lsPpDF0x5awXZrYB5ExUpsP_KFXcBvcRfyvLO9U-u4qdsiceJnj-wcM5l-7TCy2AaQro_bgClmiM23eKQk8zny3A256IUtKtUqseup6d3yxATov_gdW6hW5Zm4812k0sX3kvEl8lWIc4ZARP1UHal--OjYlS-gbDXSTvv65xoqC0686gzFQ4ZAgWFTs3PDee91OgN0',
      coordinates: { lat: -1.961, lng: 30.088 },
      mapPinLabel: '$750k',
      description:
        'Set upon the breezy ridgeline of Kimihurura with immediate proximity to Kigali Convention Centre and fine dining. Features a bespoke wine room, panoramic open salon, infinity plunge pool, and lush manicured gardens.',
    },
    {
      id: 'sale-vision-city-modern-gem',
      title: 'Vision City Modernist Gem',
      neighborhood: 'Gacuriro',
      location: 'Vision City, Gacuriro, Kigali',
      priceUsd: 390000,
      priceRwf: 507000000,
      priceDisplayUsd: '$390,000',
      priceDisplayRwf: 'RWF 507M',
      beds: 4,
      baths: 3,
      areaM2: 340,
      plotSizeM2: 600,
      propertyType: 'Master-Planned Villa',
      category: 'GATED COMMUNITY',
      aiScore: 9.4,
      badge: 'Turnkey Value',
      isFeatured: false,
      titleDeedType: 'Instant Notarized Transfer',
      projectedAppreciation: '+10.8% YoY',
      projectedYield: '9.5% Net Yield',
      yearBuilt: 2023,
      zoning: 'R2 - Planned Gated Community',
      parkingSpaces: 2,
      amenities: ['Solar Energy', 'High-Speed WiFi', 'Gated Security'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBIoH1CD8fCbIbvUl0dCcjQZgMlhVs3ydWlJEG32UisPFIr5_gW369a0uArsjdyIPEyzZjtT9SGlr7k1jGkXVDHl5mFy3lBW6LDiW1DgvkbzIONHklpO_YN-5_F5gwyJ0GuLHGhMk7JsP84P_vzFvOPC7g6Iz6z9pKeaEMYyfxvpdMSduibpWwR1hBjDUvJlx6egYWmU-YSNNXuJg01ek3JZBUNxaoP3H3shtEVN8Xq8mVd0kVwG7AO8Upm90fRb2z_M2j6UOKL6iye',
      coordinates: { lat: -1.921, lng: 30.112 },
      mapPinLabel: '$390k',
      description:
        'Immaculate turnkey luxury in Kigali’s premier master-planned gated district. 24/7 armed private community patrols, paved dual-carriageway access, underground utilities, and landscaped family playground parks.',
    },
  ];

  const apartmentsDataset = [
    {
      id: 'apt-horizon-penthouse',
      title: 'The Horizon Penthouse',
      neighborhood: 'Kiyovu',
      districtLabel: 'Kiyovu District',
      location: 'Kiyovu District, Central Kigali',
      monthlyRentUsd: 2400,
      monthlyRentRwf: 3120000,
      priceDisplay: '$2,400',
      priceDisplayRwf: 'RWF 3,120,000',
      beds: 3,
      baths: 2,
      areaM2: 185,
      floorLevel: '12th Floor',
      floorLevelCategory: '6+',
      aiScore: 9.9,
      category: 'Kiyovu District',
      amenities: ['Gym', 'Security', 'Parking', 'Concierge'],
      tags: ['Penthouse', 'Panoramic View'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCCVNPuuLKyLUmITRD4iv_J6YPSEG7K0KJjEJ85wW0jubAAOHu10KyiEB4RLiLrc2NyOectXONaKMDKAkbG3eet9Y4OOOU9nnbT_b15a9J7L_1NXgxrhQNUWlWUVBo9S5_-duxBdcCUTsFLohuJacMYcQivLpCGuuXgpLZLF15ivSJvUQcm015bFm6Pq4RN6mCZ3jTwLuGFspOk1NpyLqr_LHK91rI1ERK-H39dIvfcFBkAVEqAAP6iSdy8ql0la46AzO1Z2sqDOyXr',
      coordinates: { lat: -1.956, lng: 30.064 },
      mapPinLabel: '$2,400',
      description:
        'Stunning 12th floor residence featuring panoramic views of the city center. Includes 24/7 concierge, private gym access, and biometric security.',
    },
    {
      id: 'apt-serene-garden-loft',
      title: 'Serene Garden Loft',
      neighborhood: 'Kicukiro',
      districtLabel: 'Kicukiro Heights',
      location: 'Kicukiro Heights, Kigali',
      monthlyRentUsd: 1850,
      monthlyRentRwf: 2405000,
      priceDisplay: '$1,850',
      priceDisplayRwf: 'RWF 2,405,000',
      beds: 2,
      baths: 2,
      areaM2: 120,
      floorLevel: '2nd Floor',
      floorLevelCategory: '1-5',
      aiScore: 9.5,
      category: 'Kicukiro Heights',
      amenities: ['Gym', 'Security', 'Parking'],
      tags: ['Garden Terrace', 'High-Speed Fiber'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB4A5pPbu2n4wff1Tr7qv9v9zry3eeSo9nE_KtITAGPrz9a0R5L8ch4R3UDds7X48FppaN41kUFw7lVZr04BbA7xVq5Z1VhR7Enltmqf760cls17sOd9RKlJmFlZ4KAstBWqF_JfMOcqBIuZO2JgHz2rJTxFynuXDhKdfuJE_k3764WID9z_0Stj3BavZhcLHjoBifj3PlADM_4_5FAokdn2ryLDdthmMxecLVsKeH4EOaLDt-WZf2h66-Gpt0nLBomaaWyYK22QwCL',
      coordinates: { lat: -1.970, lng: 30.105 },
      mapPinLabel: '$1,850',
      description:
        'A tranquil escape located in the heart of Kicukiro. Minimalist design paired with lush terrace gardens and high-speed fiber connectivity.',
    },
    {
      id: 'apt-executive-studio',
      title: 'The Executive Studio',
      neighborhood: 'Nyarugenge',
      districtLabel: 'Nyarugenge Central',
      location: 'Nyarugenge Central, Financial District',
      monthlyRentUsd: 1200,
      monthlyRentRwf: 1560000,
      priceDisplay: '$1,200',
      priceDisplayRwf: 'RWF 1,560,000',
      beds: 1,
      baths: 1,
      areaM2: 75,
      floorLevel: '5th Floor',
      floorLevelCategory: '1-5',
      aiScore: 9.3,
      category: 'Nyarugenge Central',
      amenities: ['Security', 'Parking', 'Gym'],
      tags: ['Smart Home', 'Rooftop Lounge'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAuXDmAhGOsE_s4GLfOwd-Mw01QwuewhhlMARSQ_GJ2i-BlD6AbD-P4XUST-OqxSKs-ueLWWo9R23LuOpLKjZEese6rXorWcBdLYtdev4hJ0HcLjHD0Bq_WKHcgXFwhD8BNpwV42JE4co4zJnjQmCD2ut4DGV0eq7BfU3uJXLOPF3VdEehQxFgpUWQV8_d41EYxRFs-GzqXt32w_YHEdyIOkV7dS4qud9NuTU5AXx-CxWr1FR7Rpq2v9oeEIvZmXN7nZyKSBhQb4zxS',
      coordinates: { lat: -1.944, lng: 30.061 },
      mapPinLabel: '$1,200',
      description:
        'Optimized for the modern professional. Steps away from the financial district, featuring smart home integration and rooftop lounge access.',
    },
    {
      id: 'apt-kimihurura-garden-suites',
      title: 'Kimihurura Garden Suites',
      neighborhood: 'Kimihurura',
      districtLabel: 'Kimihurura Ridge',
      location: 'Kimihurura, Gasabo, Kigali',
      monthlyRentUsd: 1800,
      monthlyRentRwf: 2340000,
      priceDisplay: '$1,800',
      priceDisplayRwf: 'RWF 2,340,000',
      beds: 2,
      baths: 2,
      areaM2: 140,
      floorLevel: 'Ground',
      floorLevelCategory: 'Ground',
      aiScore: 9.4,
      category: 'Kimihurura Ridge',
      amenities: ['Gym', 'Security', 'Parking'],
      tags: ['Pool View', 'Private Garden Patio'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAufnkaZ4rdFl3uxX5o5ILbYJk3wSWx7h3ZVo2qg_t2cAOGoIK290ODFUXHBS8dUYes8anKezaamrv1mrcP8qGvFTKFgF370KwYwS06Z5WgtPgrYAheH2ZdXx5DGC85XSEU2hkabtYXjptOjOcFBDK_GXnhMh0cedDYHYfT1PSOgldaYeqxj57SJOywVMPqBUs2aOdOm3L7cl8OIJJPxPNYqitFWlPB7eSHJrnNrvPVkSAVpz3xfBOq7N0a7q43CwPBcMtnTdgaaixJ',
      coordinates: { lat: -1.961, lng: 30.088 },
      mapPinLabel: '$1,800',
      description:
        'Luxury infinity pool and private garden patio at dusk, reflecting the city lights of Kigali under a deep indigo sky.',
    },
    {
      id: 'apt-horizon-heights',
      title: 'Nyarutarama Golf Panorama Penthouse',
      neighborhood: 'Nyarutarama',
      districtLabel: 'Nyarutarama Enclave',
      location: 'Nyarutarama, District Gasabo',
      monthlyRentUsd: 2600,
      monthlyRentRwf: 3380000,
      priceDisplay: '$2,600',
      priceDisplayRwf: 'RWF 3,380,000',
      beds: 3,
      baths: 2.5,
      areaM2: 210,
      floorLevel: '14th Floor',
      floorLevelCategory: '6+',
      aiScore: 9.8,
      category: 'Nyarutarama Enclave',
      amenities: ['Gym', 'Security', 'Parking', 'Concierge'],
      tags: ['Golf Course Vista', 'Underground Valet'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA9L4OJgOUvfqUbnCl1v-rgiVQpBceNUeNhWfZ0_rliHxExMPPfU7FZrviRNnTKab7XFP-91UHPcEEhvMPa2vfyMpFi8hrK4x-UYo1U8XtfE3OQHiV7J_XdOyIIoELXmXNVU-GIOqSWkTQLiRFJe02JzXU45Fu14N06AUBZnG5aqA_yZoU4FDyZpddYKAt5d17VEsHSYiLjLP7O3patxwuuNk8UylkVj_tNIxZKnhhmsB3vepfwIPsiQS1pPq_ppw-_hSGtsRaoK7kH',
      coordinates: { lat: -1.9368, lng: 30.0988 },
      mapPinLabel: '$2,600',
      description:
        'High-end penthouse living with floor-to-ceiling glass windows at sunset, private balcony lounge, 24/7 concierge, and underground valet parking.',
    },
  ];

  const landDataset = [
    {
      id: 'plot-rebero-plateau',
      title: 'Rebero Panoramic Plateau',
      location: 'Rebero Summit, Kigali',
      price: 240000,
      priceDisplay: '$240,000',
      sizeSqm: 2500,
      zoning: 'Residential (R1)',
      topography: 'Plateau',
      investmentScore: 9.4,
      description: 'Prime residential plot with 180-degree views of the valley. Fully serviced with municipal water, fiber, and underground electricity connections.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC4G7ws4vjXvK15UU3vlPq7cIlQ2J_J7ZdQAIANOk2mk-toIGPKKeZCB8g_7OG-NK0l7-eLEJt0EOIOB4SyeLhp7wxrjnYsPN4_FB5uAOi-qGf3FWqXwPAjE-PLrVPDajC0iKtwDkxtYwA8V1rKvJrtXxJjsNFIEQ6H-GZ7Y7tG33V7XtV8EKlWIuCPhXm9DwUvksQNUi4W_ypDeWt8OwG6Q3ES6VibXdm8BhFa8cglBUs7cBHOpLoPMF5wMXbwN9iES4zXIRbvYJti',
      coordinates: { lat: -1.988, lng: 30.082 },
      verifiedTitle: true,
      growthForecast: '+14.2% YoY',
      gradientAnalysis: '5% gradient on North-East quadrant, ideal for multi-level construction.',
    },
    {
      id: 'plot-kicukiro-commercial',
      title: 'Kicukiro Commercial Hub',
      location: 'Kicukiro Business Corridor, Kigali',
      price: 450000,
      priceDisplay: '$450,000',
      sizeSqm: 5000,
      zoning: 'Commercial (C1)',
      topography: 'Flat Plain',
      investmentScore: 8.8,
      description: 'High-visibility corner plot ideal for mixed-use retail, corporate headquarters, or tech incubator development with dual-artery tarmac access.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAoDmE4y1EDZXtslRW3AXWMu9WvaXMCyNCsxduYh739ZaFKPDmyriQvL4eMNByVb_KWowtVxQkJk8OX7ZAXpd-Tl9TANdRZNrzqkdYeHN9A_LhE6ZWZkUasmI8dmSEtLm8P1gHaHnWDstLw1Oj-3nKZ0lzmLYYRLDNZB8934LFmXvt0USgtDD4kv1wWPkpQXxM_vh0sMr510u_K5vwdbjPrcYvc9G4Y9NVbBkh7couW1K8Jc-Os3T3isvdIY-qNLyTKA4D-XQ96rAqh',
      coordinates: { lat: -1.968, lng: 30.112 },
      verifiedTitle: true,
      growthForecast: '+12.4% YoY',
      gradientAnalysis: 'Flat plateau terrain with 0% runoff gradient, zero retaining wall cost required.',
    },
    {
      id: 'plot-nyarutarama-lakeview',
      title: 'Nyarutarama Lakeview Plot',
      location: 'Nyarutarama Ridge, Kigali',
      price: 380000,
      priceDisplay: '$380,000',
      sizeSqm: 3200,
      zoning: 'Residential (R1)',
      topography: 'Gentle Slope',
      investmentScore: 9.6,
      description: 'Exclusive plot with direct views of the Kigali Golf Course and artificial lake. Approved architectural designs for ambassadorial residence included.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDgk7t-O9neSfbz26AXs7VcRIgbb8g1We96jNHYU8WfCWFvoz0SEqIsCPKjcSeI-Pau3xO7mxViJhnic8SJwyKApmQXqn5Wat781J7dPEpKOYcKGji0sok8yYPyfQKhYtEheBaUf7rvdQZaddiylzEdvGyq_sYV39ggtFtCxxF2EVEQtI5dNoPsxPl1K9chO4Q6kY3TetNzj5dB548Qz6yOZP-9ERoTaTJKVqJovLtgnzsoTyZ0E4goYUnB3Vy1a61d9atrW6eKpECa',
      coordinates: { lat: -1.936, lng: 30.098 },
      verifiedTitle: true,
      growthForecast: '+15.2% YoY',
      gradientAnalysis: '8% gentle slope optimizing natural gravity drainage and stepped cantilever architecture.',
    },
  ];

  const investmentsDataset = [
    {
      id: 'invest-nyaru-villa',
      title: 'Nyaru Villa Residencies',
      location: 'Rebero Heights, Kigali',
      price: 850000,
      priceDisplay: '$850,000',
      roiYield: '8.4%',
      roiYieldNum: 8.4,
      tag: 'Investment Grade',
      landStatus: 'New Construction',
      beds: 4,
      areaM2: 1200,
      features: ['Solar-Ready', 'Infinity Pool', 'Sustainable Clay-Brick'],
      description: 'Modern Afro-Minimalism. Featuring 4 ensuite bedrooms, infinity pool, and sustainable clay-brick integration in Kigali’s fastest-appreciating scenic zone.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCilCaYhKOZCFXc6eh5EXLHWjm-I1OypFXkrmEHgLlmB3HsntZB7WlHGZIMSs0l6g7p4xgpLxAcTGaaq3p8eErYx1lXro_ep8GfK2O_RCd_R8F1yXre-MDc48ORIKDP5bmDi6y1u7K897FuQ84R9WKV8bMG8RhOaoMCGjayNhnd8jyd-K2XaIaScu7xBpIOc0ijlnyDaR0I4IHzcCfEr47GHBhNZ17m3UkCbiGKm5exe69HMbYTrPzLsoWl74Ay_ftvSG1sMd5t81HE',
      coordinates: { lat: -1.982, lng: 30.082 },
      mapPinLabel: '$850k',
    },
    {
      id: 'invest-the-timber-house',
      title: 'The Timber House',
      location: 'Nyarutarama District, Kigali',
      price: 1250000,
      priceDisplay: '$1,250,000',
      roiYield: '7.1%',
      roiYieldNum: 7.1,
      tag: 'High Demand',
      landStatus: 'New Construction',
      beds: 5,
      areaM2: 2500,
      features: ['Lap Pool', 'Teak Finishes', 'Smart-Home'],
      description: 'Nordic-Tropical Hybrid. Floor-to-ceiling glass walls, premium teak finishes, and smart-home ecosystem integration with diplomat tenancy in place.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuChUT1KipIoxLG_OjqiTZYjqJHeN2POmhudYewqr2C16moRUbUnVdZmLmzc-8VwzvvbPf5i_bmW13ztGGLuTxGe-CnCOJO_CZIXaFOCh6dZWGKdMnDw_l1vYI9YQDy9JGvtJ6f4acQThE7hSx0xRAoAArxf0mxyJurcPzBGGThLjWgYMIHc8cBJEIudVmKYIDNiX_7pOyEkMVo4wd3OnSJyPPqkDPQhHrcWpM4lQk6JCQ5wVHBJU_lvI3XhToSwH4R_ajWby4uDtj9a',
      coordinates: { lat: -1.936, lng: 30.103 },
      mapPinLabel: '$1.25M',
    },
    {
      id: 'invest-kivubelt-luxury',
      title: 'Kiyovu Panoramic Estate',
      location: 'Kiyovu, Kigali',
      price: 640000,
      priceDisplay: '$640,000',
      roiYield: '9.2%',
      roiYieldNum: 9.2,
      tag: 'Prime Yield',
      landStatus: 'Resale',
      beds: 3,
      areaM2: 850,
      features: ['Central Location', 'High Occupancy', 'Refurbished'],
      description: 'Centrally located estate in Old Kiyovu with proven 9.2% annual yield, corporate long-lease tenancy, and lush tropical mature garden.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCGGBSEI_gmOrmBmbORG_C2nEM-GUyxCi-132RFPUTpZtPku_la-yK0nuOF1q4xHNRZ7opKZ6qFlATogkeDAXVB1DivZ9rO5F97MTbTfszjYqLyOrCeWuqSDRz1xVYfxWRpMu-q9vADJNCzIr4k4laQlG4sWwsIxODyyu4QPL1PGvu9FtqTMo_0ynyQU9RY816bT2BOPcp_WeBSJ_gVHlju9WifNEQ7PNG7V2BM4UboJfWGs9Q-wSfwzbIpLfOYJT1YfV2cOX8toGPE',
      coordinates: { lat: -1.956, lng: 30.064 },
      mapPinLabel: '$640k',
    },
  ];

  // 10. API: Houses for Rent
  app.get('/api/houses', (req: Request, res: Response) => {
    let list = [...housesDataset];
    const { minRent, maxRent, bedrooms, amenities, neighborhood, search, sortBy } = req.query;

    if (minRent) list = list.filter((h) => h.monthlyRentRwf >= Number(minRent));
    if (maxRent) list = list.filter((h) => h.monthlyRentRwf <= Number(maxRent));
    if (bedrooms) list = list.filter((h) => h.beds >= Number(bedrooms));
    if (neighborhood && neighborhood !== 'All') {
      list = list.filter((h) => h.neighborhood.toLowerCase() === String(neighborhood).toLowerCase());
    }
    if (amenities) {
      const requestedAmenities = Array.isArray(amenities)
        ? (amenities as string[])
        : String(amenities).split(',').map((a) => a.trim());
      list = list.filter((h) => requestedAmenities.every((reqA) => h.amenities.includes(reqA)));
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.monthlyRentRwf - b.monthlyRentRwf);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.monthlyRentRwf - a.monthlyRentRwf);
    } else if (sortBy === 'ai-score') {
      list.sort((a, b) => b.aiScore - a.aiScore);
    }

    res.json({ success: true, count: list.length, houses: list });
  });

  app.get('/api/houses/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const house = housesDataset.find((h) => h.id === id);
    if (!house) {
      return res.status(404).json({ success: false, error: 'Rental house not found' });
    }
    res.json({ success: true, house });
  });

  app.post('/api/houses/inquiry', (req: Request, res: Response) => {
    try {
      const { houseId, houseTitle, clientName, clientEmail, clientPhone, preferredDate, notes } = req.body;
      const ref = 'RW-TOUR-' + Math.floor(1000 + Math.random() * 9000);
      res.status(201).json({
        success: true,
        message: 'Viewing inquiry booked with diplomatic chauffeur dispatch.',
        referenceCode: ref,
        houseTitle,
        preferredDate: preferredDate || 'Tomorrow 10:00 AM',
      });
    } catch (e) {
      res.status(500).json({ error: 'Failed to record house viewing inquiry' });
    }
  });

  // 10B. API: Houses for Sale
  app.get('/api/houses-for-sale', (req: Request, res: Response) => {
    let list = [...housesForSaleDataset];
    const { minPrice, maxPrice, bedrooms, amenities, neighborhood, titleDeed, search, sortBy } = req.query;

    if (minPrice) list = list.filter((h) => h.priceUsd >= Number(minPrice));
    if (maxPrice) list = list.filter((h) => h.priceUsd <= Number(maxPrice));
    if (bedrooms) list = list.filter((h) => h.beds >= Number(bedrooms));
    if (neighborhood && neighborhood !== 'All' && neighborhood !== 'All Neighborhoods') {
      list = list.filter((h) => h.neighborhood.toLowerCase() === String(neighborhood).toLowerCase());
    }
    if (titleDeed && titleDeed !== 'All' && titleDeed !== 'All Title Deeds') {
      list = list.filter((h) => h.titleDeedType.toLowerCase().includes(String(titleDeed).toLowerCase()));
    }
    if (amenities) {
      const requestedAmenities = Array.isArray(amenities)
        ? (amenities as string[])
        : String(amenities).split(',').map((a) => a.trim());
      list = list.filter((h) => requestedAmenities.every((reqA) => h.amenities.includes(reqA)));
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q) ||
          h.neighborhood.toLowerCase().includes(q) ||
          h.propertyType.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.priceUsd - b.priceUsd);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.priceUsd - a.priceUsd);
    } else if (sortBy === 'ai-score') {
      list.sort((a, b) => b.aiScore - a.aiScore);
    } else if (sortBy === 'size-desc') {
      list.sort((a, b) => b.areaM2 - a.areaM2);
    }

    res.json({
      success: true,
      count: list.length,
      housesForSale: list,
      stats: {
        totalListings: housesForSaleDataset.length,
        avgPriceUsd: Math.round(housesForSaleDataset.reduce((acc, h) => acc + h.priceUsd, 0) / housesForSaleDataset.length),
        cleanTitleRate: '100% Verified UPI Deeds',
        avgAppreciation: '+13.2% YoY'
      }
    });
  });

  app.get('/api/houses-for-sale/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const house = housesForSaleDataset.find((h) => h.id === id);
    if (!house) {
      return res.status(404).json({ success: false, error: 'House for sale not found' });
    }
    res.json({ success: true, house });
  });

  app.post('/api/houses-for-sale/inquiry', (req: Request, res: Response) => {
    try {
      const { houseId, houseTitle, clientName, clientEmail, clientPhone, preferredDate, inquiryType, notes } = req.body;
      const ref = 'RW-ACQ-' + Math.floor(1000 + Math.random() * 9000);
      res.status(201).json({
        success: true,
        message: 'Acquisition viewing & Title Deed due diligence consultation registered.',
        referenceCode: ref,
        houseTitle: houseTitle || 'Private Rwandan Estate',
        inquiryType: inquiryType || 'Private Acquisition Viewing',
        preferredDate: preferredDate || 'This Week (VIP Escort)',
        titleDeedGuarantee: 'Notarized RDB / Rwanda Land Management Authority Verified',
      });
    } catch (e) {
      res.status(500).json({ error: 'Failed to record house acquisition inquiry' });
    }
  });

  app.post('/api/houses-for-sale/mortgage-calc', (req: Request, res: Response) => {
    try {
      const { propertyPriceUsd = 500000, downPaymentPct = 20, loanTermYears = 20, interestRatePct = 8.5 } = req.body;
      const downPayment = (propertyPriceUsd * downPaymentPct) / 100;
      const principal = propertyPriceUsd - downPayment;
      const monthlyRate = interestRatePct / 100 / 12;
      const totalPayments = loanTermYears * 12;
      const monthlyPayment = (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
      res.json({
        success: true,
        propertyPriceUsd,
        downPaymentUsd: Math.round(downPayment),
        principalUsd: Math.round(principal),
        monthlyPaymentUsd: Math.round(monthlyPayment),
        loanTermYears,
        interestRatePct,
        annualPropertyTaxEst: Math.round(propertyPriceUsd * 0.001),
      });
    } catch (e) {
      res.status(500).json({ error: 'Failed to calculate mortgage' });
    }
  });

  // 11. API: Apartments for Rent
  app.get('/api/apartments', (req: Request, res: Response) => {
    let list = [...apartmentsDataset];
    const { floorLevel, bedrooms, gym, security, parking, search } = req.query;

    if (floorLevel && floorLevel !== 'All') {
      list = list.filter((a) => a.floorLevelCategory === floorLevel || a.floorLevel.toLowerCase().includes(String(floorLevel).toLowerCase()));
    }
    if (bedrooms) {
      list = list.filter((a) => a.beds >= Number(bedrooms));
    }
    if (gym === 'true') {
      list = list.filter((a) => a.amenities.includes('Gym'));
    }
    if (security === 'true') {
      list = list.filter((a) => a.amenities.includes('Security'));
    }
    if (parking === 'true') {
      list = list.filter((a) => a.amenities.includes('Parking'));
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.neighborhood.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: list.length, apartments: list });
  });

  app.get('/api/apartments/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const apt = apartmentsDataset.find((a) => a.id === id);
    if (!apt) {
      return res.status(404).json({ success: false, error: 'Apartment not found' });
    }
    res.json({ success: true, apartment: apt });
  });

  // 12. API: Strategic Land Plots
  app.get('/api/land', (req: Request, res: Response) => {
    let list = [...landDataset];
    const { minSize, maxSize, zoning, topography } = req.query;

    if (minSize) list = list.filter((p) => p.sizeSqm >= Number(minSize));
    if (maxSize) list = list.filter((p) => p.sizeSqm <= Number(maxSize));
    if (zoning && zoning !== 'All Zoning') list = list.filter((p) => p.zoning.includes(String(zoning)));
    if (topography && topography !== 'Any Terrain') list = list.filter((p) => p.topography === topography);

    res.json({ success: true, count: list.length, plots: list });
  });

  // 13. API: Luxury Investments
  app.get('/api/investments', (req: Request, res: Response) => {
    let list = [...investmentsDataset];
    const { minRoi, landStatus } = req.query;

    if (minRoi) list = list.filter((item) => item.roiYieldNum >= Number(minRoi));
    if (landStatus && landStatus !== 'All') list = list.filter((item) => item.landStatus === landStatus);

    res.json({ success: true, count: list.length, investments: list });
  });

  // 14. API: Land Inquiries & Topographic Analysis
  app.post('/api/land/inquiry', (req: Request, res: Response) => {
    try {
      const { plotId, plotTitle, fullName, email, phone, terrainNotes } = req.body;
      const inquiryRef = 'LAND-VIP-' + Math.floor(1000 + Math.random() * 9000);
      res.status(201).json({
        success: true,
        message: 'Topographic inspection dossier dispatched to engineering desk.',
        inquiryRef,
        plotTitle,
      });
    } catch (e) {
      res.status(500).json({ error: 'Failed to record land inquiry' });
    }
  });

  // 15. API: Submit Property for Listing (List Property CTA)
  app.post('/api/properties/list', (req: Request, res: Response) => {
    try {
      const { title, neighborhood, price, propertyCategory, beds, baths, areaM2, ownerName, ownerContact } = req.body;
      const listingId = 'LST-' + Date.now().toString(36).toUpperCase();
      res.status(201).json({
        success: true,
        message: 'Property listing submitted for architectural accreditation.',
        listingId,
        title,
        neighborhood,
      });
    } catch (e) {
      res.status(500).json({ error: 'Failed to submit listing' });
    }
  });

  // -------------------------------------------------------------
  // 16. Tenant & Buyer Portal Backend APIs (The Attached Page Backend)
  // -------------------------------------------------------------

  interface PortalInquiryItem {
    id: string;
    propertyId: string;
    propertyTitle: string;
    propertyImage: string;
    agentName: string;
    agentRole: string;
    agentColor: string;
    lastUpdate: string;
    status: 'In Review' | 'Scheduled' | 'Approved' | 'Completed';
    statusColor: string;
    date: string;
    notes: string;
  }

  const portalInquiriesDb: PortalInquiryItem[] = [
    {
      id: 'inq-01',
      propertyId: 'kigali-view-heights',
      propertyTitle: 'Kigali View Heights',
      propertyImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDxXtRXCeM7yJjlUpkCMS6PmV7yPQoVVwxBWQuy2zccG30V6H2LYXCjMg066TQ707HjxdRHCrJMQVah5tZKkzIrc_Q6RsSIzejHNwrrMXrX5ADkNvmpFHJUuTcMHjcal7hlPO-oqXdIdQYfgfD2EszOJQEQCGU1zZgPSYoBCSoTSPUp8GsuGdlTVVXQotqv-8FaMxqRKDsKMyp4YTBgv7lhRVjfiy82sxx98OOPmU51rg_LP26fg0va25_Mj4uJaAl5z8avC5fvC3Qi',
      agentName: 'David Rugamba',
      agentRole: 'Senior Concierge Specialist',
      agentColor: 'bg-amber-100',
      lastUpdate: '2 hours ago',
      status: 'Scheduled',
      statusColor: 'bg-emerald-100 text-emerald-800',
      date: 'Sat, Oct 17 • 2:00 PM',
      notes: 'Private viewing arranged with diplomatic chauffeur. Floor plan blueprints and land title ready.',
    },
    {
      id: 'inq-02',
      propertyId: 'the-hub-apartments',
      propertyTitle: 'The Hub Apartments',
      propertyImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBC279QpWz3qX4n0B0B7F4oWjM8K5oXW70j5_09gL5pM-v32x90l1mK8j39B0pU4bL20K8mN1_50K9B60M0pL2B3N6vL2M30v1P4K8L9M0B50v1N2M3L0K9B8M70v1N4M0L50K8N9v1P3L0K2B5N8M0v1P4K8L9M0B50v1N2M3L0K9B8M7',
      agentName: 'Sandra Umutoni',
      agentRole: 'Investment Portfolio Director',
      agentColor: 'bg-blue-100',
      lastUpdate: 'Yesterday',
      status: 'In Review',
      statusColor: 'bg-blue-100 text-blue-900',
      date: 'Tue, Oct 20 • 10:30 AM',
      notes: 'Commercial lease agreement review with Emma & Dany legal desk.',
    },
    {
      id: 'inq-03',
      propertyId: 'nyarutarama-heights',
      propertyTitle: 'Nyarutarama Heights Penthouse',
      propertyImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCUOhQL5jMcnbiwfsVMXu8wIJrtacsGdJmCc1cVFy-nc_HWacnpWp2iUct98HbBPMxx8L1q4FMktUDRKj-xLjvUUWWthqFE01CvpXMaLykGys6PXkk3HF7YtjM4Xp3GLOqJ0DWMvIMEfpsSOu0KunGp2lFZNnBY2hkLxxD67Q-S9__t5UCr3vnDLpVSt-8X9oq4UJvHy92eSyWm_NaDWL0oJsabAD117CG7-UQEZY4ouFRHLOGZh0WUaKHDyiVviz-lH40WEzrBIl4H',
      agentName: 'David Rugamba',
      agentRole: 'Senior Concierge Specialist',
      agentColor: 'bg-amber-100',
      lastUpdate: '3 days ago',
      status: 'Approved',
      statusColor: 'bg-purple-100 text-purple-900',
      date: 'Completed Inspection',
      notes: 'Proof of Funds verified; seller accepted preliminary acquisition protocol.',
    },
    {
      id: 'inq-04',
      propertyId: 'gacuriro-golf-villas',
      propertyTitle: 'Gacuriro Golf Villas',
      propertyImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD5Sf302m49Cgl-HKJ79zbgX_vYXr14YiY-2H3w1VccGCbknMc7gsPFVsvebvnaikmFIG90qJYlxf5cweT_l07hr1Ks94IrIQDYBSVfly_gNdV5KkXfm8s6U0r9VUx5kNCOqfIkPuwwCCctJqszViRLSBD-TqllsHp4q-8YjDHRVnAJl-fbU9obyTN9vslCKCvAy5sDSQOoAYZ4tcgi7C5EQoHF6dHHUSCCfGb2ImYaiwBT0Jjq1dEHcc9D628oT78YCPzen7-Yaq',
      agentName: 'Sandra Umutoni',
      agentRole: 'Investment Portfolio Director',
      agentColor: 'bg-blue-100',
      lastUpdate: '1 week ago',
      status: 'Completed',
      statusColor: 'bg-slate-100 text-slate-800',
      date: 'Tour Concluded',
      notes: 'Client reviewed architectural blueprints and environmental drainage clearance.',
    },
  ];

  const portalSavedProperties = new Set<string>([
    'kigali-view-heights',
    'the-hub-apartments',
    'nyarutarama-heights',
    'horizon-residence',
    'kivubelt-terraces',
    'vision-city-duplex',
  ]);

  const portalChatHistory: Record<string, Array<{ id: string; sender: 'user' | 'agent'; text: string; time: string }>> = {
    david: [
      {
        id: 'msg-d1',
        sender: 'agent',
        text: 'Hello Emma, I have reviewed your private viewing inquiry for Kigali View Heights. Saturday at 2:00 PM is reserved for you with our diplomatic chauffeur service.',
        time: '10:30 AM',
      },
      {
        id: 'msg-d2',
        sender: 'user',
        text: 'Thank you David! Could you please ensure the floor plan blueprints and land registry documents are ready?',
        time: '10:45 AM',
      },
      {
        id: 'msg-d3',
        sender: 'agent',
        text: 'Certainly. Everything is verified with the Rwanda Land Management and Environment Authority.',
        time: '11:02 AM',
      },
    ],
    sandra: [
      {
        id: 'msg-s1',
        sender: 'agent',
        text: 'Greetings Emma, Sandra here. The preliminary ROI audit for The Hub Apartments is ready at 8.2% net yield.',
        time: 'Yesterday',
      },
      {
        id: 'msg-s2',
        sender: 'user',
        text: 'Excellent Sandra. Can we review tax structuring under the Rwanda Development Board (RDB) incentives?',
        time: 'Yesterday',
      },
      {
        id: 'msg-s3',
        sender: 'agent',
        text: 'Yes! RDB provides standard exemptions for registered foreign and diaspora investors. I have linked the schedule.',
        time: '9:15 AM',
      },
    ],
  };

  const portalDocumentsDb = [
    {
      id: 'doc-01',
      title: 'Rwanda Land Title Deed (UPI 1/02/13/04/10452)',
      issuer: 'Rwanda Land Management and Environment Authority',
      date: 'Verified Oct 2026',
      status: 'Official',
      type: 'Title Deed',
      size: '2.4 MB',
      downloadUrl: '#',
    },
    {
      id: 'doc-02',
      title: 'Standard VIP Tenancy Agreement Template',
      issuer: 'Emma & Dany Legal Chambers',
      date: 'Updated Oct 2026',
      status: 'Ready',
      type: 'Legal',
      size: '850 KB',
      downloadUrl: '#',
    },
    {
      id: 'doc-03',
      title: 'Kigali Master Plan Zoning Compliance Certificate',
      issuer: 'City of Kigali Urban Planning',
      date: 'Issued Sep 2026',
      status: 'Certified',
      type: 'Zoning',
      size: '3.1 MB',
      downloadUrl: '#',
    },
    {
      id: 'doc-04',
      title: 'Environmental Impact Assessment (EIA) Clearance',
      issuer: 'Rwanda Environment Management Authority (REMA)',
      date: 'Valid through 2028',
      status: 'Approved',
      type: 'Environment',
      size: '1.8 MB',
      downloadUrl: '#',
    },
  ];

  // A. Get Portal Dashboard Overview Data
  app.get('/api/portal/dashboard', (req: Request, res: Response) => {
    res.json({
      success: true,
      stats: {
        savedEstatesCount: portalSavedProperties.size,
        activeInquiriesCount: portalInquiriesDb.filter((i) => i.status === 'In Review' || i.status === 'Scheduled').length,
        portfolioValue: '$1.2M',
        newMatchesToday: 2,
      },
      inquiries: portalInquiriesDb,
      marketTrends: [
        { district: 'Gasabo', growth: '+15.2%', percent: 85 },
        { district: 'Kicukiro', growth: '+12.4%', percent: 75 },
        { district: 'Nyarugenge', growth: '+8.9%', percent: 60 },
      ],
      recentActivity: [
        {
          id: 'act-1',
          type: 'price_drop',
          title: 'Price Drop Alert',
          description: "The property 'Palm Grove' just dropped by $15,000.",
          time: '14 mins ago',
        },
        {
          id: 'act-2',
          type: 'portfolio_view',
          title: 'New View',
          description: 'Sandra Umutoni viewed your shared portfolio link.',
          time: '2 hours ago',
        },
        {
          id: 'act-3',
          type: 'document_verified',
          title: 'Document Verified',
          description: "Your 'Proof of Funds' was verified by the admin team.",
          time: '5 hours ago',
        },
      ],
    });
  });

  // B. Get / Create / Update Inquiries
  app.get('/api/portal/inquiries', (req: Request, res: Response) => {
    res.json({ success: true, inquiries: portalInquiriesDb });
  });

  app.post('/api/portal/inquiries', (req: Request, res: Response) => {
    try {
      const { propertyId, propertyTitle, propertyImage, agentName, date, notes } = req.body;
      const newInquiry: PortalInquiryItem = {
        id: 'inq-' + Date.now().toString(36),
        propertyId: propertyId || 'general',
        propertyTitle: propertyTitle || 'Exclusive Viewing Request',
        propertyImage:
          propertyImage ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDxXtRXCeM7yJjlUpkCMS6PmV7yPQoVVwxBWQuy2zccG30V6H2LYXCjMg066TQ707HjxdRHCrJMQVah5tZKkzIrc_Q6RsSIzejHNwrrMXrX5ADkNvmpFHJUuTcMHjcal7hlPO-oqXdIdQYfgfD2EszOJQEQCGU1zZgPSYoBCSoTSPUp8GsuGdlTVVXQotqv-8FaMxqRKDsKMyp4YTBgv7lhRVjfiy82sxx98OOPmU51rg_LP26fg0va25_Mj4uJaAl5z8avC5fvC3Qi',
        agentName: agentName || 'David Rugamba',
        agentRole: 'Senior Concierge Specialist',
        agentColor: 'bg-amber-100',
        lastUpdate: 'Just now',
        status: 'Scheduled',
        statusColor: 'bg-emerald-100 text-emerald-800',
        date: date || 'Tomorrow • 10:00 AM',
        notes: notes || 'Private showing arranged by client via online portal.',
      };
      portalInquiriesDb.unshift(newInquiry);
      res.status(201).json({ success: true, inquiry: newInquiry });
    } catch (e) {
      res.status(500).json({ error: 'Failed to create inquiry' });
    }
  });

  app.patch('/api/portal/inquiries/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, date, notes } = req.body;
    const item = portalInquiriesDb.find((i) => i.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    if (status) item.status = status;
    if (date) item.date = date;
    if (notes) item.notes = notes;
    item.lastUpdate = 'Just now';
    res.json({ success: true, inquiry: item });
  });

  // C. Saved Estates API
  app.get('/api/portal/saved', (req: Request, res: Response) => {
    res.json({ success: true, savedIds: Array.from(portalSavedProperties) });
  });

  app.post('/api/portal/saved', (req: Request, res: Response) => {
    const { propertyId } = req.body;
    if (!propertyId) return res.status(400).json({ error: 'Property ID required' });
    if (portalSavedProperties.has(propertyId)) {
      portalSavedProperties.delete(propertyId);
      res.json({ success: true, saved: false, count: portalSavedProperties.size });
    } else {
      portalSavedProperties.add(propertyId);
      res.json({ success: true, saved: true, count: portalSavedProperties.size });
    }
  });

  // D. Portal Messages API
  app.get('/api/portal/messages', (req: Request, res: Response) => {
    const agent = (req.query.agent as string) || 'david';
    const history = portalChatHistory[agent] || portalChatHistory.david;
    res.json({ success: true, agent, messages: history });
  });

  app.post('/api/portal/messages', (req: Request, res: Response) => {
    const { agent, text } = req.body;
    const targetAgent = agent === 'sandra' ? 'sandra' : 'david';
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text required' });
    }

    const userMsg = {
      id: 'msg-' + Date.now().toString(36),
      sender: 'user' as const,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (!portalChatHistory[targetAgent]) {
      portalChatHistory[targetAgent] = [];
    }
    portalChatHistory[targetAgent].push(userMsg);

    // Auto concierge response after simulated agent typing
    const replyText =
      targetAgent === 'david'
        ? "Thank you for reaching out Emma. I have noted this in your private dossier and will coordinate with the property manager immediately."
        : "Noted with thanks Emma. I will prepare the financial schedule and have the paperwork ready for our advisory call.";

    const agentReply = {
      id: 'msg-rep-' + Date.now().toString(36),
      sender: 'agent' as const,
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    portalChatHistory[targetAgent].push(agentReply);

    res.json({
      success: true,
      sent: userMsg,
      reply: agentReply,
      messages: portalChatHistory[targetAgent],
    });
  });

  // E. Documents & Market Report API
  app.get('/api/portal/documents', (req: Request, res: Response) => {
    res.json({ success: true, documents: portalDocumentsDb });
  });

  app.post('/api/portal/report', (req: Request, res: Response) => {
    res.json({
      success: true,
      reportId: 'RPT-KGL-' + Math.floor(100000 + Math.random() * 900000),
      title: 'Q3/Q4 2026 Kigali High-End Residential & Land Yield Report',
      generatedAt: new Date().toISOString(),
      downloadUrl: '#',
      summary: 'Average rental yields across Gasabo and Nyarutarama stand at 10.2% with a 98% diplomatic occupancy rate.',
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
