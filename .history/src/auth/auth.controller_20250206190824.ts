@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() body: { email: string; password: string }, @Res() res: Response) {
        try {
            // Check if the email already exists
            const existingUser = await this.authService.findUserByEmail(body.email);
            if (existingUser) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    error: 'Account already exists',
                });
            }

            // Register the user and get the result which includes the token
            const result = await this.authService.register(body.email, body.password);
            
            if (result.token) {
                // Send JWT token after successful registration
                return res.status(HttpStatus.CREATED).json({
                    message: 'User registered successfully',
                    token: result.token,
                });
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'User registration failed',
                });
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
        try {
            console.log('Login attempt:', body.email); // Debugging
            const result = await this.authService.login(body.email, body.password);
            
            if (!result.token) {
                console.log('Login failed: No token');
                return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid credentials' });
            }
            
            console.log('Login successful:', result.token);
            return res.status(HttpStatus.OK).json({
                message: result.message,
                token: result.token,
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
        }
    }
}
