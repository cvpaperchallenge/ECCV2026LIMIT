import { Link } from "react-router";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-footer-background/80 backdrop-blur-xl py-12 md:py-16 flex flex-col items-center mt-24">
      <div className="container mx-auto grid gap-12 md:grid-cols-2 lg:grid-cols-4 px-6 xl:max-w-6xl">
        {/* Logo and Workshop Name */}
        {/* <div className="flex flex-col gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg">LIMIT Workshop</span>
          </Link>
          <p className="text-sm text-muted-foreground">ICCV 2025</p>
        </div> */}

        {/* Past LIMIT Workshop */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-lg">Past Workshops</h3>
          <Link
            to="https://limit-workshop.github.io/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            ICCV 2025 LIMIT
          </Link>
          <Link
            to="https://hirokatsukataoka16.github.io/CVPR-2024-LIMIT"
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            CVPR 2024 LIMIT
          </Link>
          <Link
            to="https://lsfsl.net/limit23/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            ICCV 2023 LIMIT
          </Link>
        </div>

        {/* Related Workshop */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-lg">Related Workshops</h3>
          <Link
            to="https://eccv2026-found-workshop.limitlab.xyz"
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            ECCV 2026 FOUND
          </Link>
          <Link
            to="https://cvpr2026-bigmac-workshop.limitlab.xyz"
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            CVPR 2026 BigMAC
          </Link>
          <Link
            to="https://cvpr2026-vgi-workshop.limitlab.xyz/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            CVPR 2026 VGI
          </Link>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-lg">Quick Links</h3>
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/#cfp"
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Call for Papers
            </Link>
            <Link
              to="/#program"
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Program
            </Link>
            <Link
              to="/#organizers"
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Organizers
            </Link>
            <Link
              to="/#sponsors"
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Sponsors
            </Link>
            <Link
              to="/#contact"
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Share */}
        <div className="flex flex-col -mt-5">
          <div className="rounded-2xl p-px bg-gradient-to-br from-primary/40 via-primary/15 to-transparent">
            <div className="rounded-2xl bg-muted/20 backdrop-blur-sm p-5 flex flex-col gap-5 h-full">
              <h3 className="font-bold text-base">Spread the Word</h3>
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">
                  Hashtags
                </p>
                <span className="text-sm text-muted-foreground font-medium select-all cursor-text">
                  #ECCV2026LIMIT
                </span>
                <span className="text-sm text-muted-foreground font-medium select-all cursor-text">
                  #LIMITWorkshop
                </span>
              </div>
              <a
                href="/workshop-flyer.png"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary/70 hover:text-primary transition-colors mt-auto"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                View Flyer
              </a>
            </div>
          </div>
        </div>

        {/* Social Links
        <div className="flex flex-col gap-2">
          <h3 className="font-medium">Connect</h3>
          <div className="flex gap-2">
            <Button
              className="hover:bg-footer-accent dark:hover:bg-footer-accent/50"
              variant="ghost"
              size="icon"
              asChild
            >
              <a href="#" target="_blank" rel="noreferrer">
                <X className="h-4 w-4" />
                <span className="sr-only">X</span>
              </a>
            </Button>
            <Button
              className="hover:bg-footer-accent dark:hover:bg-footer-accent/50"
              variant="ghost"
              size="icon"
              asChild
            >
              <a href="#" target="_blank" rel="noreferrer">
                <SiGithub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button
              className="hover:bg-footer-accent dark:hover:bg-footer-accent/50"
              variant="ghost"
              size="icon"
              asChild
            >
              <a href="#" target="_blank" rel="noreferrer">
                <SiYoutube className="h-4 w-4" />
                <span className="sr-only">YouTube</span>
              </a>
            </Button>
            <Button
              className="hover:bg-footer-accent dark:hover:bg-footer-accent/50"
              variant="ghost"
              size="icon"
              asChild
            >
              <a href="#" target="_blank" rel="noreferrer">
                <SiSlack className="h-4 w-4" />
                <span className="sr-only">Slack</span>
              </a>
            </Button>
          </div>
        </div> */}
      </div>

      {/* Credits */}
      <div className="container mx-auto mt-12 border-t border-border/50 pt-8 px-6 xl:max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="font-bold text-xl group-hover:text-primary transition-colors">
              LIMIT Workshop
            </span>
          </Link>
          <p className="text-center text-sm text-muted-foreground font-medium">
            &copy; {new Date().getFullYear()} LIMIT Workshop. All rights
            reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground md:text-right font-medium">
            Built by cvpaper.challenge Dev Team
          </p>
        </div>
      </div>
    </footer>
  );
}
