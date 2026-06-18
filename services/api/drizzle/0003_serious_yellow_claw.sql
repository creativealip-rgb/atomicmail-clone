ALTER TABLE "messages" ADD COLUMN "starred" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "messages_starred_idx" ON "messages" USING btree ("starred");